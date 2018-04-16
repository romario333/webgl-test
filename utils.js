export function createCanvas() {
    // remove any existing canvas
    const oldCanvas = document.querySelector('canvas');
    oldCanvas && document.body.removeChild(oldCanvas);

    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 700;

    document.body.appendChild(canvas);
    return canvas;
}

export function time(timerName) {
    time.timers = time.timers || {};

    time.timers[timerName] = {name: timerName, start: new Date()};
    console.time(timerName);
}

export function timeEnd(timerName) {
    time.timers[timerName].end = new Date();
    console.timeEnd(timerName);
}

export function printTimes() {
    const stats = document.querySelector("#stats");
    stats.innerText = Object.values(time.timers).map(t => `${t.name}: ${t.end - t.start} ms`).join('\n');
}

