function gmod(n, m) {
    return ((n % m) + m) % m;
}

function kuwaiticalendar(gYear, gMonth, gDay) {
    var adjust = 0;
    var today = new Date(gYear, gMonth - 1, gDay);
    var day = today.getDate();
    var month = today.getMonth();
    var year = today.getFullYear();
    var m = month + 1;
    var y = year;
    if (m < 3) {
        y -= 1;
        m += 12;
    }

    var a = Math.floor(y / 100.);
    var b = 2 - a + Math.floor(a / 4.);
    if (y < 1583) b = 0;
    if (y == 1582) {
        if (m > 10) b = -10;
        if (m == 10) {
            b = 0;
            if (day > 4) b = -10;
        }
    }

    var jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;

    b = 0;
    if (jd > 2299160) {
        a = Math.floor((jd - 1867216.25) / 36524.25);
        b = 1 + a - Math.floor(a / 4.);
    }
    var bb = jd + b + 1524;
    var cc = Math.floor((bb - 122.1) / 365.25);
    var dd = Math.floor(365.25 * cc);
    var ee = Math.floor((bb - dd) / 30.6001);
    day = (bb - dd) - Math.floor(30.6001 * ee);
    month = ee - 1;
    if (ee > 13) {
        cc += 1;
        month = ee - 13;
    }
    year = cc - 4716;

    var iyear = 10631. / 30.;
    var epochastro = 1948084;
    var shift1 = 8.01 / 60.;

    var z = jd - epochastro;
    var cyc = Math.floor(z / 10631.);
    z = z - 10631 * cyc;
    var j = Math.floor((z - shift1) / iyear);
    var iy = 30 * cyc + j;
    z = z - Math.floor(j * iyear + shift1);
    var im = Math.floor((z + 28.5001) / 29.5);
    if (im == 13) im = 12;
    var id = z - Math.floor(29.5001 * im - 29);

    return [day, month, year, jd - 1, gmod(jd + 1 - adjust, 7) + 1, id, im - 1, iy];
}

function hijriToGregorian(hYear, hMonth, hDay) {
    var jd = Math.floor((11 * hYear + 3) / 30) + 354 * hYear + 30 * hMonth - Math.floor((hMonth - 1) / 2) + hDay + 1948440 - 385;
    if (jd > 2299160) {
        var l = jd + 68569;
        var n = Math.floor((4 * l) / 146097);
        l = l - Math.floor((146097 * n + 3) / 4);
        var i = Math.floor((4000 * (l + 1)) / 1461001);
        l = l - Math.floor((1461 * i) / 4) + 31;
        var j = Math.floor((80 * l) / 2447);
        var d = l - Math.floor((2447 * j) / 80);
        l = Math.floor(j / 11);
        var m = j + 2 - 12 * l;
        var y = 100 * (n - 49) + i + l;
    } else {
        var j = jd + 1402;
        var k = Math.floor((j - 1) / 1461);
        var l = j - 1461 * k;
        var n = Math.floor((l - 1) / 365) - Math.floor(l / 1461);
        var i = l - 365 * n + 30;
        var j = Math.floor((80 * i) / 2447);
        var d = i - Math.floor((2447 * j) / 80);
        i = Math.floor(j / 11);
        var m = j + 2 - 12 * i;
        var y = 4 * k + n + i - 4716;
    }

    return new Date(y, m - 1, d);
}

function gregorianToShamsi(gYear, gMonth, gDay) {
    var g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var jy = (gYear <= 1600) ? 0 : 979;
    gYear -= (gYear <= 1600) ? 621 : 1600;
    var gy2 = (gMonth > 2) ? (gYear + 1) : gYear;
    var days = (365 * gYear) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gDay + g_d_m[gMonth - 1];
    jy += 33 * Math.floor(days / 12053);
    days %= 12053;
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
        jy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365;
    }
    var jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
    var jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
    return [jy, jm, jd];
}

function shamsiToGregorian(jy, jm, jd) {
    var sal_a = [0, 31, (jy % 4 === 3) ? 30 : 29, 31, 30, 31, 30, 31, 30, 31, 30, 29];
    jy += 1595;
    var days = -355668 + (365 * jy) + (Math.floor(jy / 33) * 8) + Math.floor(((jy % 33) + 3) / 4) + jd + sal_a.slice(0, jm).reduce((a, b) => a + b, 0);
    var gy = 400 * Math.floor(days / 146097);
    days %= 146097;
    if (days > 36524) {
        gy += 100 * Math.floor(--days / 36524);
        days %= 36524;
        if (days >= 365) days++;
    }
    gy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
        gy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365;
    }
    var gd = days + 1;
    var gm;
    for (gm = 0; gm < 13; gm++) {
        var v = [31, (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][gm];
        if (gd <= v) break;
        gd -= v;
    }
    return [gy, gm + 1, gd];
}

// Function to handle conversion and update results
function handleConversion() {
    var gYear = parseInt(document.getElementById('g-year').value);
    var gMonth = parseInt(document.getElementById('g-month').value);
    var gDay = parseInt(document.getElementById('g-day').value);

    var hYear = parseInt(document.getElementById('h-year').value);
    var hMonth = parseInt(document.getElementById('h-month').value);
    var hDay = parseInt(document.getElementById('h-day').value);

    var sYear = parseInt(document.getElementById('s-year').value);
    var sMonth = parseInt(document.getElementById('s-month').value);
    var sDay = parseInt(document.getElementById('s-day').value);

    if (!isNaN(gYear) && !isNaN(gMonth) && !isNaN(gDay)) {
        var hijriDate = kuwaiticalendar(gYear, gMonth, gDay);
        var shamsiDate = gregorianToShamsi(gYear, gMonth, gDay);
        
        document.getElementById('h-year').value = hijriDate[7];
        document.getElementById('h-month').value = hijriDate[6] + 1;
        document.getElementById('h-day').value = hijriDate[5];

        document.getElementById('s-year').value = shamsiDate[0];
        document.getElementById('s-month').value = shamsiDate[1];
        document.getElementById('s-day').value = shamsiDate[2];

        document.getElementById('gregorian-result').innerText = `Gregorian: ${gYear}-${gMonth}-${gDay}`;
        document.getElementById('hijri-result').innerText = `Hijri: ${hijriDate[7]}-${hijriDate[6] + 1}-${hijriDate[5]}`;
        document.getElementById('shamsi-result').innerText = `Shamsi: ${shamsiDate[0]}-${shamsiDate[1]}-${shamsiDate[2]}`;
    } else if (!isNaN(hYear) && !isNaN(hMonth) && !isNaN(hDay)) {
        var gregorianDate = hijriToGregorian(hYear, hMonth, hDay);
        var shamsiDate = gregorianToShamsi(gregorianDate.getFullYear(), gregorianDate.getMonth() + 1, gregorianDate.getDate());

        document.getElementById('g-year').value = gregorianDate.getFullYear();
        document.getElementById('g-month').value = gregorianDate.getMonth() + 1;
        document.getElementById('g-day').value = gregorianDate.getDate();

        document.getElementById('s-year').value = shamsiDate[0];
        document.getElementById('s-month').value = shamsiDate[1];
        document.getElementById('s-day').value = shamsiDate[2];

        document.getElementById('gregorian-result').innerText = `Gregorian: ${gregorianDate.getFullYear()}-${gregorianDate.getMonth() + 1}-${gregorianDate.getDate()}`;
        document.getElementById('hijri-result').innerText = `Hijri: ${hYear}-${hMonth}-${hDay}`;
        document.getElementById('shamsi-result').innerText = `Shamsi: ${shamsiDate[0]}-${shamsiDate[1]}-${shamsiDate[2]}`;
    } else if (!isNaN(sYear) && !isNaN(sMonth) && !isNaN(sDay)) {
        var gregorianDate = shamsiToGregorian(sYear, sMonth, sDay);
        var hijriDate = kuwaiticalendar(gregorianDate[0], gregorianDate[1], gregorianDate[2]);

        document.getElementById('g-year').value = gregorianDate[0];
        document.getElementById('g-month').value = gregorianDate[1];
        document.getElementById('g-day').value = gregorianDate[2];

        document.getElementById('h-year').value = hijriDate[7];
        document.getElementById('h-month').value = hijriDate[6] + 1;
        document.getElementById('h-day').value = hijriDate[5];

        document.getElementById('gregorian-result').innerText = `Gregorian: ${gregorianDate[0]}-${gregorianDate[1]}-${gregorianDate[2]}`;
        document.getElementById('hijri-result').innerText = `Hijri: ${hijriDate[7]}-${hijriDate[6] + 1}-${hijriDate[5]}`;
        document.getElementById('shamsi-result').innerText = `Shamsi: ${sYear}-${sMonth}-${sDay}`;
    }
}

// Event listener for any click on the document to trigger conversion
document.addEventListener('click', function() {
    handleConversion();
});
