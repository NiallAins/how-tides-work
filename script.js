//
// Init
//
const
    oCan = document.getElementById('orbitCan'),
    oCtx = oCan.getContext('2d'),
    wCan = document.getElementById('waveCan'),
    wCtx = wCan.getContext('2d'),
    dateText = document.getElementById('dateText'),
    sunSizeEl = document.getElementById('sunSize'),
    earthTiltEl = document.getElementById('earthTilt'),
    moonSizeEl = document.getElementById('moonSize'),
    moonPhaseEl = document.getElementById('moonPhase'),
    startingDate = new Date('01-01-2021').valueOf(),
    col = {
        bg: '#444',
        bg_l: '#777',
        text: '#ccc',
        moon: '#bbb',
        sun: '#cc5',
        sea: '#5bb',
        darken: '#0004'
    },
    // Period and phase of earth and moon orbits for 2021
    periods = {
        tide: [0.52, 0.26],
        phase: [29.53, 28],
        perigee: [27.32, 9],
        perihelion: [365, 2]
    };
oCan.width = 400;
oCan.height = 400;
oCtx.translate(200, 200);
wCan.width = 365 * 60;
wCan.height = 400;
wCtx.translate(0, wCan.height / 2);

// Scroll listener
document.getElementById('waveContain').addEventListener('scroll', function (e) {
    let day = 365 * (this.scrollLeft / (this.scrollWidth - this.clientWidth));
    window.requestAnimationFrame(() => drawOrbit(day));
});
document.getElementById('waveContain').addEventListener('mousemove', function (e) {
    let day = 365 * (e.offsetX / this.scrollWidth);
    window.requestAnimationFrame(() => drawOrbit(day));
});

//
// Orbit
//
function drawOrbit(day) {
    oCtx.clearRect(-1000, -1000, 2000, 2000);
    oCtx.setLineDash([2, 2]);

    const
        earthRad = 100,
        earthX = Math.cos(Math.PI * 2 * (day / 365)) * earthRad,
        earthY = Math.sin(Math.PI * 2 * (day / 365)) * earthRad,
        moonRad = 50,
        currentPhase = (day + 1) / (periods.phase[0] * (13 / 14)),
        moonX = Math.cos(Math.PI * 2 * currentPhase) * moonRad,
        moonY = Math.sin(Math.PI * 2 * currentPhase) * moonRad,
        perigeeX = 12,
        perigeeY = -12,
        sunAng = Math.atan2(earthY, earthX) + (Math.PI / 2);

    // Sun
    oCtx.fillStyle = col.sun;
    oCtx.beginPath();
    oCtx.arc(20, 0, 15, 0, Math.PI * 2);
    oCtx.fill();
    oCtx.strokeStyle = col.sun;
    oCtx.lineWidth = 2;
    oCtx.beginPath();
    oCtx.moveTo(20, 0);
    oCtx.lineTo(earthX, earthY);
    oCtx.stroke();

    // Earth
    oCtx.strokeStyle = col.sea;
    oCtx.lineWidth = 1;
    oCtx.beginPath();
    oCtx.arc(0, 0, earthRad, 0, Math.PI * 2);
    oCtx.stroke();

    oCtx.save();
    oCtx.translate(earthX, earthY);
    oCtx.save();
    // Moonaxis
    oCtx.strokeStyle = col.moon;
    oCtx.lineWidth = 2;
    oCtx.beginPath();
    oCtx.moveTo(0, 0);
    oCtx.lineTo(moonX + perigeeX, moonY + perigeeY);
    oCtx.stroke();
    oCtx.rotate(((day + 0.75) * (364 / 364.75)) * Math.PI * 2);
    // Axis
    oCtx.strokeStyle = col.sea;
    oCtx.setLineDash([]);
    oCtx.lineWidth = 2;
    oCtx.beginPath();
    oCtx.moveTo(0, 0);
    oCtx.lineTo(18, 0);
    oCtx.stroke();
    // Globe
    oCtx.fillStyle = col.sea;
    oCtx.beginPath();
    oCtx.arc(0, 0, 12, 0, Math.PI * 2);
    oCtx.fill();
    oCtx.restore();
    // Shade
    oCtx.fillStyle = col.darken;
    oCtx.beginPath();
    oCtx.arc(
        0, 0, 12, sunAng, sunAng + Math.PI, true);
    oCtx.fill();

    // Moon
    oCtx.translate(perigeeX, perigeeY);
    oCtx.strokeStyle = col.moon;
    oCtx.beginPath();
    oCtx.arc(0, 0, moonRad, 0, Math.PI * 2);
    oCtx.stroke();

    oCtx.save();
    oCtx.translate(moonX, moonY);
    oCtx.fillStyle = col.moon;
    oCtx.beginPath();
    oCtx.arc(0, 0, 10, 0, Math.PI * 2);
    oCtx.fill();
    // Shade
    oCtx.fillStyle = col.darken;
    oCtx.beginPath();
    oCtx.arc(
        0, 0, 10, sunAng, sunAng + Math.PI, true);
    oCtx.fill();
    oCtx.restore();
    oCtx.restore();

    // Globes
    sunSize.style.animationDelay =
        '-' +
        ((day + 180) / 365).toFixed(3) +
        's';
    earthTilt.style.animationDelay =
        '-' +
        ((day + 157) / 365).toFixed(3) +
        's';
    moonSize.style.animationDelay =
        '-' +
        ((day + (periods.perigee[0] - periods.perigee[1])) / periods.perigee[0]).toFixed(3) +
        's';
    moonPhaseEl.style.animationDelay =
        '-' +
        ((day + (periods.phase[0] - periods.phase[1])) / periods.phase[0]).toFixed(3) +
        's';
    dateText.innerHTML = new Date(startingDate + (day * 8.64e7)).toString().substring(4, 10);
}
// Start on today's date
drawOrbit(
    Math.floor(
        (new Date() - new Date('2021-01-01')) /
        (1000 * 60 * 60 * 24)
    )
);


//
// Graph
//

// Axis
wCtx.strokeStyle = col.bg_l;
wCtx.lineWidth = 2;
wCtx.beginPath();
wCtx.moveTo(0, 0);
wCtx.lineTo(wCan.width, 0);
wCtx.stroke();

function drawSine(params, color, width = 1, dashed = []) {
    if (typeof params[0] === 'number') {
        params = [params];
    }
    params = params.map(p => ({
        period: Math.PI * 2 * (365 / p[0]),
        offset: Math.PI * 2 * (p[2] / p[0]),
        amp: p[1] * 10
    }));
    wCtx.beginPath();
    wCtx.strokeStyle = color;
    wCtx.lineWidth = width;
    wCtx.setLineDash(dashed);
    for (let x = 0; x < wCan.width; x += 1) {
        let amp = params.reduce(
            (t, p, i) => i === 0 ? t : t + (p.amp * Math.cos((p.period * (x / wCan.width)) - p.offset)),
            params[0].amp
        );
        wCtx.lineTo(
            x,
            -1 * amp * Math.cos((params[0].period * (x / wCan.width)) - params[0].offset)
        );
    }
    wCtx.stroke();
}

drawSine([
    [periods.tide[0], 9, periods.tide[1]],
    [periods.tide[0] * 2, 1, periods.tide[1]],
    [periods.phase[0] / 2, 4, periods.phase[1]],
    [periods.perigee[0], 1, periods.perigee[1]],
    [periods.perihelion[0], 0.5, periods.perihelion[1]]
], col.sea, 1);

drawSine([periods.tide[0] * 2, 5, periods.tide[1]], col.sea, 1, [3, 3]);
drawSine([periods.phase[0], 8, periods.phase[1]], col.moon, 2);
drawSine([periods.perigee[0], 8, periods.perigee[1]], col.moon, 2, [2, 2]);
drawSine([periods.perihelion[0], 8, periods.perihelion[1]], col.sun, 2, [2, 2]);

// Labels
wCtx.font = '12px Helvetica';
wCtx.fillStyle = col.text;
const
    monthNames = [
        'JANUARY', 'FEBURARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ],
    monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let currentDay = 0;
monthDays.forEach((days, i) => {
    let x = Math.floor((wCan.width / 365) * currentDay);
    wCtx.fillText(monthNames[i], x + 5, 15);
    currentDay += days;
});
wCtx.fillText('EQUINOX', (wCan.width / 365 * 78), -10);
wCtx.fillText('SOLSTICE', (wCan.width / 365 * 171), -10);
wCtx.fillText('EQUINOX', (wCan.width / 365 * 264), -10);
wCtx.fillText('SOLSTICE', (wCan.width / 365 * 354), -10);
