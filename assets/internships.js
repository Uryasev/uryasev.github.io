/* Filter the internship table by firm group, degree and location.
 *
 * A firm with several roles spans its Firm and Type cells over the rows that
 * follow, so rows cannot be hidden individually without leaving those spans
 * pointing at rows that are gone. Filtering on degree or location therefore
 * rebuilds each firm's block from its surviving rows and re-sets the spans.
 *
 * The control is hidden in the markup and revealed here, so a reader without
 * JavaScript sees the full table rather than selects that do nothing. */
(function () {
    'use strict';

    var table = document.querySelector('table.intern-table');
    var type = document.getElementById('intern-type');
    var deg = document.getElementById('intern-deg');
    var loc = document.getElementById('intern-loc');
    if (!table || !type || !deg || !loc) { return; }

    var wrap = type.closest('.intern-filter');
    var count = document.getElementById('intern-filter-count');
    var body = table.tBodies[0];
    var rows = Array.prototype.slice.call(body.rows);

    /* Group the rows as they were built: a row without .intern-cont starts a
     * firm, and the rows after it belong to that same firm. */
    var blocks = [];
    rows.forEach(function (row) {
        if (!row.classList.contains('intern-cont')) {
            blocks.push({ first: row, rows: [row] });
        } else if (blocks.length) {
            blocks[blocks.length - 1].rows.push(row);
        }
    });

    /* The firm and type cells belong to the row the page was built with. Put
     * them back there before every pass, so a filter never inherits where the
     * previous one moved them. */
    function restore(block) {
        var first = block.first;
        var holder = block.rows.filter(function (r) {
            return r.querySelector('td.c-firm');
        })[0];
        if (holder && holder !== first) {
            var firmCell = holder.querySelector('td.c-firm');
            var typeCell = holder.querySelector('td.c-type');
            first.insertBefore(typeCell, first.firstChild);
            first.insertBefore(firmCell, typeCell);
            holder.classList.add('intern-cont');
        }
        first.classList.remove('intern-cont');
        block.rows.forEach(function (r) {
            if (r !== first) { r.classList.add('intern-cont'); }
        });
    }

    function cities(row) {
        return (row.getAttribute('data-loc') || '').split(';').map(function (c) {
            return c.trim();
        }).filter(Boolean);
    }

    function matches(row, wantDeg, wantLoc) {
        if (wantDeg && row.getAttribute('data-deg') !== wantDeg) { return false; }
        if (wantLoc && cities(row).indexOf(wantLoc) === -1) { return false; }
        return true;
    }

    function apply() {
        var wantType = type.value, wantDeg = deg.value, wantLoc = loc.value;
        var firms = 0, roles = 0;

        blocks.forEach(function (block) {
            restore(block);
            var all = block.rows;

            if (wantType && block.first.getAttribute('data-type') !== wantType) {
                all.forEach(function (r) { r.hidden = true; });
                return;
            }

            /* A closed firm has no role to match on, so it survives only when
             * neither of the role filters is set. */
            if (!block.first.querySelector('.intern-open')) {
                var keep = !wantDeg && !wantLoc;
                block.first.hidden = !keep;
                if (keep) { firms++; }
                return;
            }

            var kept = all.filter(function (r) { return matches(r, wantDeg, wantLoc); });
            all.forEach(function (r) { r.hidden = kept.indexOf(r) === -1; });
            if (!kept.length) { return; }

            firms++;
            roles += kept.length;

            /* Move the firm and type cells onto the first surviving row and
             * span them over the rest of what survived. */
            var firstKept = kept[0];
            if (firstKept !== block.first) {
                var firmCell = block.first.querySelector('td.c-firm');
                var typeCell = block.first.querySelector('td.c-type');
                firstKept.insertBefore(typeCell, firstKept.firstChild);
                firstKept.insertBefore(firmCell, typeCell);
                firstKept.classList.remove('intern-cont');
                block.first.classList.add('intern-cont');
            }
            ['td.c-firm', 'td.c-type'].forEach(function (sel) {
                var cell = firstKept.querySelector(sel);
                if (!cell) { return; }
                if (kept.length > 1) { cell.rowSpan = kept.length; }
                else { cell.removeAttribute('rowspan'); }
            });
        });

        if (count) {
            var parts = [];
            if (wantType || wantDeg || wantLoc) {
                parts.push(firms + (firms === 1 ? ' firm' : ' firms'));
                parts.push(roles + (roles === 1 ? ' role' : ' roles') + ' open');
            }
            count.textContent = parts.join(', ');
        }

        try {
            ['intern-type', 'intern-deg', 'intern-loc'].forEach(function (k, i) {
                var v = [wantType, wantDeg, wantLoc][i];
                if (v) { localStorage.setItem(k, v); } else { localStorage.removeItem(k); }
            });
        } catch (e) { /* private window or blocked storage: filtering still works */ }
    }

    [[type, 'intern-type'], [deg, 'intern-deg'], [loc, 'intern-loc']].forEach(function (pair) {
        var el = pair[0], key = pair[1], saved = '';
        try { saved = localStorage.getItem(key) || ''; } catch (e) { saved = ''; }
        if (saved && el.querySelector('option[value="' + saved.replace(/"/g, '\\"') + '"]')) {
            el.value = saved;
        }
        el.addEventListener('change', apply);
    });

    if (wrap) { wrap.hidden = false; }
    apply();
}());
