/**
 * Renders cumulative Hyperscale block anatomy cards; field hovers reuse glossary.js tooltips.
 * Requires: glossary.js (first), block-evolution-data.js
 */
(function () {
  'use strict';

  function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text == null ? '' : String(text);
    return d.innerHTML;
  }

  function getPreviouslyIntroduced(data, stepId) {
    const order = data.STEP_ORDER || Object.keys(data.STEPS || {});
    const idx = order.indexOf(stepId);
    const introduced = new Set();
    if (idx <= 0) return introduced;
    for (let i = 0; i < idx; i++) {
      const prior = data.STEPS[order[i]];
      if (prior && prior.newFields) {
        prior.newFields.forEach((fid) => introduced.add(fid));
      }
    }
    return introduced;
  }

  function fieldHighlightClass(data, stepId, fieldId, step) {
    const newSet = new Set(step.newFields || []);
    if (newSet.has(fieldId)) return 'hs-block-field--new';
    if (getPreviouslyIntroduced(data, stepId).has(fieldId)) return 'hs-block-field--seen';
    return 'hs-block-field--present';
  }

  function renderFieldRow(fieldDef, step, highlightClass) {
    const sample =
      (step.sampleOverrides && step.sampleOverrides[fieldDef.id]) || fieldDef.sample;
    const rowClass = 'hs-block-field ' + highlightClass;
    const valClass = 'hs-block-value' + (fieldDef.valueClass ? ' ' + fieldDef.valueClass : '');

    return (
      '<div class="' +
      rowClass +
      '">' +
      '<span class="hs-block-field-label" tabindex="0" data-glossary="' +
      escapeHtml(fieldDef.glossaryKey) +
      '">' +
      escapeHtml(fieldDef.label) +
      '</span>' +
      '<span class="' +
      valClass +
      '">' +
      escapeHtml(sample) +
      '</span>' +
      '</div>'
    );
  }

  function renderBlock(stepId) {
    const data = window.BLOCK_EVOLUTION;
    if (!data) return '';
    const step = data.STEPS[stepId];
    if (!step) return '<p class="hs-block-error">Unknown block step: ' + escapeHtml(stepId) + '</p>';

    if (step.kind === 'empty') {
      return (
        '<article class="hs-block-card hs-block-card--empty" data-block-step="' +
        escapeHtml(stepId) +
        '">' +
        '<header class="hs-block-card-header">' +
        '<span class="hs-block-phase-tag">Phase ' +
        step.phase +
        '</span>' +
        '<h3 class="hs-block-card-title">' +
        escapeHtml(step.title) +
        '</h3>' +
        '<p class="hs-block-card-sub">' +
        escapeHtml(step.subtitle) +
        '</p>' +
        '</header>' +
        '<div class="hs-block-empty-body">' +
        step.message +
        '</div>' +
        '</article>'
      );
    }

    const visible = new Set(step.visibleFields || []);
    const hasNew = step.newFields && step.newFields.length;
    const hasSeen = [...visible].some((fid) =>
      getPreviouslyIntroduced(data, stepId).has(fid)
    );
    const hasPresent = [...visible].some((fid) => {
      const cls = fieldHighlightClass(data, stepId, fid, step);
      return cls === 'hs-block-field--present';
    });

    let headerRows = '';
    data.HEADER_ORDER.forEach((fid) => {
      if (!visible.has(fid)) return;
      headerRows += renderFieldRow(
        data.FIELDS[fid],
        step,
        fieldHighlightClass(data, stepId, fid, step)
      );
    });

    let bodyRows = '';
    data.BODY_ORDER.forEach((fid) => {
      if (!visible.has(fid)) return;
      bodyRows += renderFieldRow(
        data.FIELDS[fid],
        step,
        fieldHighlightClass(data, stepId, fid, step)
      );
    });

    const badge = step.badge
      ? '<span class="hs-block-status-badge">' + escapeHtml(step.badge) + '</span>'
      : '';
    let legend =
      '<p class="hs-block-legend">Hover any field for glossary depth';
    if (hasNew) {
      legend += ' · <span class="hs-block-legend-new"></span> green = new at this card';
    }
    if (hasSeen) {
      legend += ' · grey = introduced on an earlier card';
    }
    if (hasPresent) {
      legend += ' · muted default = visible here, taught later';
    }
    legend += '</p>';

    return (
      '<article class="hs-block-card" data-block-step="' +
      escapeHtml(stepId) +
      '">' +
      '<header class="hs-block-card-header">' +
      '<span class="hs-block-phase-tag">Phase ' +
      step.phase +
      '</span>' +
      badge +
      '<h3 class="hs-block-card-title">' +
      escapeHtml(step.title) +
      '</h3>' +
      '<p class="hs-block-card-sub">' +
      escapeHtml(step.subtitle) +
      '</p>' +
      legend +
      '</header>' +
      '<div class="hs-block-shell">' +
      '<div class="hs-block-panel">' +
      '<div class="hs-block-panel-label">BlockHeader</div>' +
      '<div class="hs-block-fields">' +
      headerRows +
      '</div>' +
      '</div>' +
      '<div class="hs-block-panel hs-block-panel--body">' +
      '<div class="hs-block-panel-label">Block body (Live)</div>' +
      '<div class="hs-block-fields">' +
      bodyRows +
      '</div>' +
      '</div>' +
      '</div>' +
      '</article>'
    );
  }

  function initMounts() {
    document.querySelectorAll('[data-block-evolution]').forEach((mount) => {
      const stepId = mount.getAttribute('data-block-evolution');
      mount.innerHTML = renderBlock(stepId);
      if (typeof window.initializeGlossary === 'function') {
        window.initializeGlossary(mount);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMounts);
  } else {
    initMounts();
  }

  function formatNewFields(stepId) {
    const data = window.BLOCK_EVOLUTION;
    if (!data || !stepId) return '—';
    const step = data.STEPS[stepId];
    if (!step) return '—';
    if (step.kind === 'empty') return '(no BlockHeader)';
    const ids = step.newFields || [];
    if (!ids.length) return '— (shape unchanged)';
    return ids
      .map((id) => {
        const f = data.FIELDS[id];
        return f ? f.label : id;
      })
      .join(', ');
  }

  function renderBlockBirdseyeTable() {
    const data = window.BLOCK_EVOLUTION;
    if (!data || !data.BIRDSEYE_ROWS) {
      return '<p class="hs-block-error">Block bird\'s-eye data not loaded.</p>';
    }

    let rows = '';
    data.BIRDSEYE_ROWS.forEach((row) => {
      const phaseCell = row.phaseHref
        ? '<a href="' + escapeHtml(row.phaseHref) + '">' + escapeHtml(row.phaseLabel) + '</a>'
        : escapeHtml(row.phaseLabel);
      const statusCell = row.blockStepId
        ? '<code>' + escapeHtml(row.blockStatus) + '</code>'
        : escapeHtml(row.blockStatus);
      const newFields = formatNewFields(row.blockStepId);
      rows +=
        '<tr>' +
        '<td>' + escapeHtml(row.txFlowSteps) + '</td>' +
        '<td>' + phaseCell + '</td>' +
        '<td>' + statusCell + '</td>' +
        '<td class="hs-block-birdseye-new">' + escapeHtml(newFields) + '</td>' +
        '<td>' + escapeHtml(row.note || '') + '</td>' +
        '</tr>';
    });

    return (
      '<div class="table-wrap table-wrap--reflow">' +
      '<table class="hs-block-birdseye-table">' +
      '<thead><tr>' +
      '<th scope="col">Tx flow step</th>' +
      '<th scope="col">Phase module</th>' +
      '<th scope="col">Block card</th>' +
      '<th scope="col">New fields <span class="hs-block-legend-new" title="Pistachio green in phase modules"></span></th>' +
      '<th scope="col">Note</th>' +
      '</tr></thead><tbody>' +
      rows +
      '</tbody></table></div>' +
      '<p class="module-footnote module-footnote--tight">Canonical field list: <code>common/block-evolution-data.js</code>. Phase modules render cumulative cards — hover underlined fields for glossary tooltips.</p>'
    );
  }

  function initBirdseyeMounts() {
    document.querySelectorAll('[data-block-birdseye]').forEach((mount) => {
      mount.innerHTML = renderBlockBirdseyeTable();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBirdseyeMounts);
  } else {
    initBirdseyeMounts();
  }

  window.renderHyperscaleBlock = renderBlock;
  window.renderBlockBirdseyeTable = renderBlockBirdseyeTable;
  window.initBlockEvolution = initMounts;
})();
