/*! Built with http://stenciljs.com */
StDatepicker.loadBundle("./chunk2.js", ["exports", "./chunk1.js"], function (e, t) { window.StDatepicker.h, e.filterDayLabel = function (e) { return "" + e[0] + e[1]; }, e.validNewDateParam = function (e, t, a) { switch (a) {
    case "INCREMENT": return 11 === t ? (e += 1) && (t = 0) : t += 1, { year: e, month: t };
    case "DECREMENT": return 0 === t ? (e -= 1) && (t = 11) : t -= 1, { year: e, month: t };
    default: return;
} }, e.buildCalendar = function (e, a, l, n) { var d = []; var r = 11 === e.month ? 0 : e.month + 1, s = 11 === e.month ? e.year + 1 : e.year, u = new Date(e.year, e.month, 1), i = new Date(s, r, 0), f = { start: t.default(u), end: t.default(i) }; var o = f.start; var c = o.diff(f.end, "days"), Y = t.default(); for (var e_1 = 0; e_1 < Math.abs(c); e_1++) {
    var e_2 = o.format("YYYY-MM-DD"), r_1 = Y.format("YYYY-MM-DD");
    var s_1 = !1, u_1 = !1, i_1 = !1, f_1 = !1;
    if ("range" === a.mode) {
        var a_1 = n ? n.rangeStartValue.format("YYYY-MM-DD") : null, l_1 = n ? n.rangeEndValue.format("YYYY-MM-DD") : null;
        l_1 && a_1 && t.default(e_2).isBetween(a_1, l_1) && (f_1 = !0), t.default(e_2).isSame(a_1) && (u_1 = !0), t.default(e_2).isSame(l_1) && (u_1 = !0);
    }
    else if ("single" === a.mode) {
        var a_2 = l ? l.format("YYYY-MM-DD") : null;
        t.default(e_2).isSame(a_2) && (u_1 = !0);
    }
    else
        t.default(e_2).isSame(r_1) && (s_1 = !0), this.optionsModel.activePreviousDate && t.default(e_2).isBefore(r_1) && (i_1 = !0);
    d.push({ date: o, disable: i_1, current: s_1, isBetween: f_1, selected: u_1 }), o = t.default(o).add(1, "days");
} for (var e_3 = 1; e_3 <= f.start.day() - a.startWeek; e_3++) {
    var a_3 = t.default(f.start).subtract(e_3, "days");
    d.length <= 35 && (d = [{ date: a_3, disable: !0, selected: !1, isBetween: !1, current: !1 }].concat(d));
} if (d.length / 7 > 5)
    for (var e_4 = t.default(f.end).day() - 1 + 1; e_4 <= 6; e_4++) {
        var t_1 = f.end.add(e_4, "days");
        d = d.concat([{ date: t_1, disable: !0, selected: !1, isBetween: !1, current: !1 }]);
    }
else if (d.length < 35) {
    var e_5 = 0;
    for (var a_4 = d.length; a_4 < 35; a_4++) {
        e_5 += 1;
        var a_5 = t.default(f.end).add(e_5, "days");
        d = d.concat([{ date: a_5, disable: !0, selected: !1, isBetween: !1, current: !1 }]);
    }
} return d; }; });
