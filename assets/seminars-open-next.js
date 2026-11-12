/* Opens the seminar nearest to today instead of whatever comes first.
 *
 * Runs after the page's own script has turned the lists into jQuery UI
 * accordions. It reads each talk's "Date/Time" field, picks the next upcoming
 * one (or the most recent if the series has ended) and opens both that talk
 * and the semester holding it.
 */
$(function () {
    var MONTHS = {jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
                  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11};
    // "5 February, 2027, 10:00-11:00 AM" and "1 May 2020, Friday, ..."
    var DATE_RE = /(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?,?\s+(\d{4})/i;
    var SEMESTER_RE = /^(spring|fall|summer|winter)\s+\d{4}\s+semester$/i;

    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var best = null;

    // Walk the talk headings only: a semester heading's panel holds every talk
    // in that semester, so reading a date from it would match the wrong one.
    $('h3').each(function () {
        var header = $(this);
        if (SEMESTER_RE.test(header.text().trim())) { return; }

        var panel = header.next();
        if (!panel.length) { return; }

        var m = DATE_RE.exec(panel.text());
        if (!m) { return; }

        var when = new Date(+m[3], MONTHS[m[2].toLowerCase().slice(0, 3)], +m[1]);
        var upcoming = when >= today;
        // prefer the soonest upcoming talk; fall back to the latest past one
        if (!best ||
            (upcoming && (!best.upcoming || when < best.when)) ||
            (!upcoming && !best.upcoming && when > best.when)) {
            best = {header: header, when: when, upcoming: upcoming};
        }
    });

    if (!best) { return; }

    // Drive the widgets the way a visitor would: jQuery UI handles a click on
    // a header itself, so a nested accordion is laid out correctly even when
    // its semester was collapsed a moment earlier.
    var talk = best.header;
    var semHeader = talk.closest('.ui-accordion-content').prevAll('h3').first();

    // The page opens the first entry of each "open-initial" accordion; close
    // anything that is not what we are about to open.
    $('h3.ui-state-active').each(function () {
        var h = $(this);
        if (h.is(talk) || h.is(semHeader)) { return; }
        h.trigger('click');
    });

    if (semHeader.length && !semHeader.hasClass('ui-state-active')) {
        semHeader.trigger('click');
    }

    // The semester panel slides open, so wait for the talk header to be on
    // screen; a click on a hidden header does nothing.
    var tries = 0;
    (function openWhenReady() {
        if (talk.is(':visible')) {
            if (!talk.hasClass('ui-state-active')) { talk.trigger('click'); }
            return;
        }
        if (++tries < 40) { setTimeout(openWhenReady, 50); }
    })();
});
