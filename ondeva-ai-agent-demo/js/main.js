document.addEventListener(
  "DOMContentLoaded",
  () => {

    const experience =
      document.getElementById(
        "experience"
      );

    const agentNode =
      document.getElementById(
        "agentNode"
      );

    const ondevaNode =
      document.getElementById(
        "ondevaNode"
      );

    const capabilityButtons =
      [
        ...document.querySelectorAll(
          ".capability"
        )
      ];

    const promptText =
      document.getElementById(
        "promptText"
      );

    const promptCursor =
      document.getElementById(
        "promptCursor"
      );

    const resultCard =
      document.getElementById(
        "resultCard"
      );

    const resultTitle =
      document.getElementById(
        "resultTitle"
      );

    const resultCopy =
      document.getElementById(
        "resultCopy"
      );

    const resultVisual =
      document.getElementById(
        "resultVisual"
      );

    const connections =
      document.getElementById(
        "connections"
      );

    const canvas =
      document.getElementById(
        "proximityCanvas"
      );

    const ctx =
      canvas.getContext("2d");


    let selectedCapability =
      null;

    let currentRun =
      0;


    const lastVariation = {
      database: null,
      workflow: null,
      apis: null
    };


    /* ============================================================
       SCENARIOS
       ============================================================ */

    const data = {

      database: [

        {
          id: 1,

          prompt:
            "1 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          title:
            "Database result 1",

          copy:
            "1 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          visual:
            "bars"
        },

        {
          id: 2,

          prompt:
            "2 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          title:
            "Database result 2",

          copy:
            "2 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          visual:
            "donut"
        },

        {
          id: 3,

          prompt:
            "3 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          title:
            "Database result 3",

          copy:
            "3 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          visual:
            "line"
        },

        {
          id: 4,

          prompt:
            "4 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          title:
            "Database result 4",

          copy:
            "4 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          visual:
            "kpi"
        }

      ],


      workflow: [

        {
          id: 1,

          prompt:
            "1 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          title:
            "Workflow result 1",

          copy:
            "1 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          visual:
            "line"
        },

        {
          id: 2,

          prompt:
            "2 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          title:
            "Workflow result 2",

          copy:
            "2 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          visual:
            "bars"
        },

        {
          id: 3,

          prompt:
            "3 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          title:
            "Workflow result 3",

          copy:
            "3 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          visual:
            "kpi"
        },

        {
          id: 4,

          prompt:
            "4 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          title:
            "Workflow result 4",

          copy:
            "4 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          visual:
            "donut"
        }

      ],


      apis: [

        {
          id: 1,

          prompt:
            "1 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          title:
            "API result 1",

          copy:
            "1 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          visual:
            "donut"
        },

        {
          id: 2,

          prompt:
            "2 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          title:
            "API result 2",

          copy:
            "2 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          visual:
            "line"
        },

        {
          id: 3,

          prompt:
            "3 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          title:
            "API result 3",

          copy:
            "3 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          visual:
            "bars"
        },

        {
          id: 4,

          prompt:
            "4 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          title:
            "API result 4",

          copy:
            "4 Lorem ipsum dolor sit amet, consectetur adipiscing elit.",

          visual:
            "kpi"
        }

      ]

    };


    /* ============================================================
       RANDOM VARIATION
       ============================================================ */

    function getVariation(
      capability
    ) {

      const options =
        data[capability];

      const previous =
        lastVariation[
          capability
        ];

      let candidates =
        options.filter(
          option =>
            option.id !==
            previous
        );


      if (
        candidates.length === 0
      ) {
        candidates =
          options;
      }


      const randomIndex =
        Math.floor(
          Math.random() *
          candidates.length
        );


      const choice =
        candidates[
          randomIndex
        ];


      lastVariation[
        capability
      ] =
        choice.id;


      return choice;

    }


    /* ============================================================
       RESULT VISUALS
       ============================================================ */

    function createBars() {

      const values =
        [48, 78, 61, 92, 68];


      const wrapper =
        document.createElement(
          "div"
        );


      wrapper.className =
        "chart-bars";


      values.forEach(
        value => {

          const bar =
            document.createElement(
              "div"
            );


          bar.className =
            "chart-bar";


          bar.style.height =
            `${value}%`;


          wrapper.appendChild(
            bar
          );

        }
      );


      return wrapper;

    }


    function createDonut() {

      const wrapper =
        document.createElement(
          "div"
        );


      wrapper.className =
        "chart-donut";


      const value =
        document.createElement(
          "div"
        );


      value.className =
        "chart-donut-value";


      value.textContent =
        "68%";


      wrapper.appendChild(
        value
      );


      return wrapper;

    }


    function createLine() {

      const wrapper =
        document.createElement(
          "div"
        );


      wrapper.className =
        "chart-line";


      wrapper.innerHTML = `
        <svg
          viewBox="0 0 260 140"
          preserveAspectRatio="none"
        >

          <path
            d="
              M 5 110
              C 35 98,
                48 82,
                72 87

              C 100 92,
                115 54,
                142 60

              C 170 67,
                183 30,
                210 38

              C 228 41,
                242 24,
                255 18
            "
          />

          <circle
            cx="72"
            cy="87"
            r="4"
          />

          <circle
            cx="142"
            cy="60"
            r="4"
          />

          <circle
            cx="210"
            cy="38"
            r="4"
          />

          <circle
            cx="255"
            cy="18"
            r="4"
          />

        </svg>
      `;


      return wrapper;

    }


    function createKpi() {

      const wrapper =
        document.createElement(
          "div"
        );


      wrapper.className =
        "chart-kpi";


      wrapper.innerHTML = `
        <div
          class="chart-kpi-value"
        >
          84%
        </div>

        <div
          class="chart-kpi-label"
        >
          Lorem ipsum
        </div>
      `;


      return wrapper;

    }


    function renderVisual(
      type
    ) {

      resultVisual.innerHTML =
        "";


      let visual;


      switch (
        type
      ) {

        case "bars":
          visual =
            createBars();
          break;


        case "donut":
          visual =
            createDonut();
          break;


        case "line":
          visual =
            createLine();
          break;


        case "kpi":
          visual =
            createKpi();
          break;


        default:
          visual =
            createBars();

      }


      resultVisual.appendChild(
        visual
      );

    }


    /* ============================================================
       PROMPT
       ============================================================ */

    function typePrompt(
      text,
      run
    ) {

      return new Promise(
        resolve => {

          promptText.textContent =
            "";


          promptCursor.hidden =
            false;


          const duration =
            1050;


          const interval =
            Math.max(
              12,
              duration /
              text.length
            );


          let index = 0;


          function next() {

            if (
              run !==
              currentRun
            ) {

              resolve();

              return;

            }


            promptText.textContent =
              text.slice(
                0,
                index + 1
              );


            index++;


            if (
              index <
              text.length
            ) {

              setTimeout(
                next,
                interval
              );

            } else {

              promptCursor.hidden =
                true;


              resolve();

            }

          }


          setTimeout(
            next,
            120
          );

        }
      );

    }


    /* ============================================================
       FLOW
       ============================================================ */

    function point(
      element,
      side
    ) {

      const container =
        experience.getBoundingClientRect();


      const rect =
        element.getBoundingClientRect();


      let x =
        rect.left -
        container.left +
        rect.width / 2;


      if (
        side === "left"
      ) {

        x =
          rect.left -
          container.left;

      }


      if (
        side === "right"
      ) {

        x =
          rect.right -
          container.left;

      }


      return {

        x,

        y:
          rect.top -
          container.top +
          rect.height / 2

      };

    }


    function makePath(
      start,
      end,
      className
    ) {

      const ns =
        "http://www.w3.org/2000/svg";


      const path =
        document.createElementNS(
          ns,
          "path"
        );


      path.setAttribute(
        "class",
        className
      );


      const distance =
        Math.max(
          30,
          Math.abs(
            end.x -
            start.x
          ) * .42
        );


      path.setAttribute(
        "d",
        `
          M ${start.x} ${start.y}
          C ${start.x + distance} ${start.y},
            ${end.x - distance} ${end.y},
            ${end.x} ${end.y}
        `
      );


      connections.appendChild(
        path
      );


      return path;

    }


    function animateDot(
      path,
      delay = 0
    ) {

      setTimeout(
        () => {

          if (
            !path.isConnected
          ) {
            return;
          }


          const ns =
            "http://www.w3.org/2000/svg";


          const dot =
            document.createElementNS(
              ns,
              "circle"
            );


          dot.setAttribute(
            "r",
            "5"
          );


          dot.setAttribute(
            "class",
            "flow-dot"
          );


          connections.appendChild(
            dot
          );


          const length =
            path.getTotalLength();


          const duration =
            420;


          const start =
            performance.now();


          function frame(
            now
          ) {

            if (
              !dot.isConnected
            ) {
              return;
            }


            const progress =
              Math.min(
                1,
                (now - start) /
                duration
              );


            const position =
              path.getPointAtLength(
                length *
                progress
              );


            dot.setAttribute(
              "cx",
              position.x
            );


            dot.setAttribute(
              "cy",
              position.y
            );


            if (
              progress < 1
            ) {

              requestAnimationFrame(
                frame
              );

            } else {

              dot.remove();

            }

          }


          requestAnimationFrame(
            frame
          );

        },
        delay
      );

    }


    function drawFlow(
      animate = false
    ) {

      connections.innerHTML =
        "";


      if (
        window.innerWidth <=
        900
      ) {
        return;
      }


      const rect =
        experience.getBoundingClientRect();


      connections.setAttribute(
        "viewBox",
        `0 0 ${rect.width} ${rect.height}`
      );


      const agentRight =
        point(
          agentNode,
          "right"
        );


      const ondevaLeft =
        point(
          ondevaNode,
          "left"
        );


      const agentPath =
        makePath(
          agentRight,
          ondevaLeft,
          "line active"
        );


      const ondevaRight =
        point(
          ondevaNode,
          "right"
        );


      capabilityButtons.forEach(
        button => {

          const capabilityLeft =
            point(
              button,
              "left"
            );


          const isActive =
            button ===
            selectedCapability;


          const path =
            makePath(
              ondevaRight,
              capabilityLeft,
              isActive
                ? "line active"
                : "line"
            );


          if (
            animate &&
            isActive
          ) {

            animateDot(
              path,
              420
            );

          }

        }
      );


      if (
        !selectedCapability
      ) {
        return;
      }


      const selectedRight =
        point(
          selectedCapability,
          "right"
        );


      const resultLeft =
        point(
          resultCard,
          "left"
        );


      const resultPath =
        makePath(
          selectedRight,
          resultLeft,
          "line active"
        );


      if (
        animate
      ) {

        animateDot(
          agentPath,
          0
        );


        animateDot(
          resultPath,
          1150
        );

      }

    }


    /* ============================================================
       SHOW RESULT
       ============================================================ */

    function showResult(
      variation
    ) {

      resultTitle.textContent =
        variation.title;


      resultCopy.textContent =
        variation.copy;


      renderVisual(
        variation.visual
      );


      resultCard.classList.remove(
        "is-loading"
      );

    }


    /* ============================================================
       RUN SEQUENCE
       ============================================================ */

    async function runSequence() {

      if (
        !selectedCapability
      ) {
        return;
      }


      currentRun++;


      const run =
        currentRun;


      const key =
        selectedCapability
          .dataset
          .capability;


      const variation =
        getVariation(
          key
        );


      resultCard.classList.add(
        "is-loading"
      );


      promptText.textContent =
        "";


      promptCursor.hidden =
        true;


      drawFlow(
        true
      );


      await typePrompt(
        variation.prompt,
        run
      );


      if (
        run !==
        currentRun
      ) {
        return;
      }


      setTimeout(
        () => {

          if (
            run !==
            currentRun
          ) {
            return;
          }


          showResult(
            variation
          );

        },
        450
      );

    }


    /* ============================================================
       SELECT CAPABILITY
       ============================================================ */

    function selectCapability(
      button
    ) {

      selectedCapability =
        button;


      capabilityButtons.forEach(
        item => {

          const selected =
            item === button;


          item.classList.toggle(
            "selected",
            selected
          );


          item.classList.toggle(
            "dimmed",
            !selected
          );


          const action =
            item.querySelector(
              ".capability-action"
            );


          action.textContent =
            selected
              ? "✓"
              : "+";

        }
      );


      runSequence();

    }


    /* ============================================================
       DIRECTION-AWARE SHADOW
       ============================================================ */

    capabilityButtons.forEach(
      card => {

        card.addEventListener(
          "mousemove",
          event => {

            const rect =
              card.getBoundingClientRect();


            const centerX =
              rect.width / 2;


            const centerY =
              rect.height / 2;


            const x =
              event.clientX -
              rect.left -
              centerX;


            const y =
              event.clientY -
              rect.top -
              centerY;


            const maxOffset =
              11;


            const shadowX =
              -(
                x /
                centerX
              ) *
              maxOffset;


            const shadowY =
              -(
                y /
                centerY
              ) *
              maxOffset;


            card.style.setProperty(
              "--shadow-x",
              `${shadowX}px`
            );


            card.style.setProperty(
              "--shadow-y",
              `${shadowY}px`
            );

          }
        );


        card.addEventListener(
          "mouseleave",
          () => {

            card.style.setProperty(
              "--shadow-x",
              "0px"
            );


            card.style.setProperty(
              "--shadow-y",
              "8px"
            );

          }
        );

      }
    );


    /* ============================================================
       FOIL MOUSE RESPONSE
       ============================================================ */

    experience.addEventListener(
      "mousemove",
      event => {

        const rect =
          resultCard.getBoundingClientRect();


        const x =
          (
            (
              event.clientX -
              rect.left
            ) /
            rect.width
          ) * 100;


        const y =
          (
            (
              event.clientY -
              rect.top
            ) /
            rect.height
          ) * 100;


        const safeX =
          Math.max(
            0,
            Math.min(
              100,
              x
            )
          );


        const safeY =
          Math.max(
            0,
            Math.min(
              100,
              y
            )
          );


        resultCard.style.setProperty(
          "--foil-x",
          `${safeX}%`
        );


        resultCard.style.setProperty(
          "--foil-y",
          `${safeY}%`
        );

      }
    );


    /* ============================================================
       PROXIMITY CANVAS
       ============================================================ */

    let dots = [];


    const mouse = {
      x: -1000,
      y: -1000
    };


    function createDots(
      width,
      height
    ) {

      dots = [];


      const gap =
        30;


      for (
        let y = gap;
        y < height;
        y += gap
      ) {

        for (
          let x = gap;
          x < width;
          x += gap
        ) {

          dots.push({

            x,
            y,

            radius: 1.05,

            currentRadius:
              1.05

          });

        }

      }

    }


    function resizeCanvas() {

      const rect =
        experience
          .getBoundingClientRect();


      const dpr =
        window
          .devicePixelRatio ||
        1;


      canvas.width =
        Math.round(
          rect.width *
          dpr
        );


      canvas.height =
        Math.round(
          rect.height *
          dpr
        );


      canvas.style.width =
        `${rect.width}px`;


      canvas.style.height =
        `${rect.height}px`;


      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );


      createDots(
        rect.width,
        rect.height
      );

    }


    experience.addEventListener(
      "mousemove",
      event => {

        const rect =
          experience
            .getBoundingClientRect();


        mouse.x =
          event.clientX -
          rect.left;


        mouse.y =
          event.clientY -
          rect.top;

      }
    );


    experience.addEventListener(
      "mouseleave",
      () => {

        mouse.x =
          -1000;


        mouse.y =
          -1000;

      }
    );


    function drawDots() {

      const rect =
        experience
          .getBoundingClientRect();


      ctx.clearRect(
        0,
        0,
        rect.width,
        rect.height
      );


      dots.forEach(
        dot => {

          const dx =
            mouse.x -
            dot.x;


          const dy =
            mouse.y -
            dot.y;


          const distance =
            Math.sqrt(
              dx * dx +
              dy * dy
            );


          const influence =
            Math.max(
              0,
              1 -
              distance /
              155
            );


          const targetRadius =
            1.05 +
            influence *
            4.8;


          dot.currentRadius +=
            (
              targetRadius -
              dot.currentRadius
            ) *
            .13;


          const r =
            Math.round(
              74 +
              45 *
              influence
            );


          const g =
            Math.round(
              67 +
              125 *
              influence
            );


          const b =
            Math.round(
              194 +
              35 *
              influence
            );


          const alpha =
            .09 +
            influence *
            .48;


          ctx.beginPath();


          ctx.arc(
            dot.x,
            dot.y,
            dot.currentRadius,
            0,
            Math.PI * 2
          );


          ctx.fillStyle =
            `rgba(
              ${r},
              ${g},
              ${b},
              ${alpha}
            )`;


          ctx.fill();

        }
      );


      requestAnimationFrame(
        drawDots
      );

    }


    /* ============================================================
       CARD CLICK
       ============================================================ */

    capabilityButtons.forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            selectCapability(
              button
            );

          }
        );

      }
    );


    /* ============================================================
       RESIZE
       ============================================================ */

    let resizeFrame;


    window.addEventListener(
      "resize",
      () => {

        cancelAnimationFrame(
          resizeFrame
        );


        resizeFrame =
          requestAnimationFrame(
            () => {

              resizeCanvas();

              drawFlow(
                false
              );

            }
          );

      }
    );


    /* ============================================================
       INITIAL
       ============================================================ */

    resizeCanvas();

    drawDots();


    requestAnimationFrame(
      () => {

        const firstCapability =
          capabilityButtons[0];


        if (
          firstCapability
        ) {

          selectCapability(
            firstCapability
          );

        }

      }
    );

  }
);