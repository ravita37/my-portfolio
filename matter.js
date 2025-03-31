var canvas = document.getElementById('wrapper-canvas');

var dimensions = {
    width: window.innerWidth,
    height: window.innerHeight,
};

Matter.use('matter-attractors');
Matter.use('matter-wrap');

function runMatter() {
    if (window.innerWidth < 768) {
        console.log("Canvas animation disabled on small screens.");
        return null; // Stop execution on small screens
    }

    var Engine = Matter.Engine,
        Events = Matter.Events,
        Runner = Matter.Runner,
        Render = Matter.Render,
        World = Matter.World,
        Body = Matter.Body,
        Common = Matter.Common,
        Bodies = Matter.Bodies;

    var engine = Engine.create();
    engine.world.gravity.y = 0;
    engine.world.gravity.x = 0;
    engine.world.gravity.scale = 0.1;

    var render = Render.create({
        element: canvas,
        engine: engine,
        options: {
            showVelocity: false,
            width: dimensions.width,
            height: dimensions.height,
            wireframes: false,
            background: 'black', // Black background
        },
    });

    var runner = Runner.create();
    var world = engine.world;
    world.gravity.scale = 0;

    // Bigger Circle (Dark Pink with Glow)
    var attractiveBody = Bodies.circle(
        render.options.width / 2,
        render.options.height / 2,
        Math.max(dimensions.width / 25, dimensions.height / 25) / 2,
        {
            render: {
                fillStyle: `#733e5d`, // Dark Pink
                strokeStyle: `#7d4f69`, // Darker Pink Border
                lineWidth: 5,
                shadowBlur: 60, // Strong Glow
                shadowColor: `#ff69b4`, // Bright Pink Glow
            },
            isStatic: true,
            plugin: {
                attractors: [
                    function (bodyA, bodyB) {
                        return {
                            x: (bodyA.position.x - bodyB.position.x) * 1e-6,
                            y: (bodyA.position.y - bodyB.position.y) * 1e-6,
                        };
                    },
                ],
            },
        }
    );

    World.add(world, attractiveBody);

    // Create floating light pink particles
    for (var i = 0; i < 12; i++) {
        let x = Common.random(0, render.options.width);
        let y = Common.random(0, render.options.height);

        var circle = Bodies.circle(x, y, Common.random(2, 8), {
            mass: 0.1,
            friction: 0,
            frictionAir: 0.01,
            render: {
                fillStyle: `#eaacec`, // Light Pink
                strokeStyle: `#8a3866`, // Same Light Pink Border
                lineWidth: 2,
                shadowBlur: 20, // Soft Glow
                shadowColor: `#ffc0cb`, // Light Pink Glow
            },
        });

        World.add(world, circle);
    }

    // Mouse Move Effect
    document.addEventListener('mousemove', function (event) {
        if (!event.clientX) return;
        Body.translate(attractiveBody, {
            x: (event.clientX - attractiveBody.position.x) * 0.12,
            y: (event.clientY - attractiveBody.position.y) * 0.12,
        });
    });

    let data = {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function () {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        },
        play: function () {
            Matter.Runner.run(runner, engine);
            Matter.Render.run(render);
        },
    };

    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);
    return data;
}

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function setWindowSize() {
    if (window.innerWidth < 768) return; // Stop updating if screen is small

    let dimensions = {};
    dimensions.width = window.innerWidth;
    dimensions.height = window.innerHeight;

    if (m) {
        m.render.canvas.width = window.innerWidth;
        m.render.canvas.height = window.innerHeight;
    }
    return dimensions;
}

let m = runMatter();
setWindowSize();
window.addEventListener('resize', debounce(setWindowSize, 250));
