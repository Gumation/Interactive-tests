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
            "Find customers with an overdue request and no follow-up scheduled.",

          title:
            "3 customers need attention",

          copy:
            `Requests were matched with account records.<br>
            <strong>Oldest request:</strong> 6 days overdue<br>
            <strong>Next step:</strong> Review priority list`,

          visual:
            "kpi",

          visualValue:
            "3",

          visualLabel:
            "Customers"
        },


        {
          id: 2,

          prompt:
            "Show new customer sign-ups by month for the last six months.",

          title:
            "Sign-ups over time",

          copy:
            `A small line graph shows the monthly trend.<br>
            <strong>This month:</strong> 42 sign-ups<br>
            <strong>Change:</strong> +18% from last month`,

          visual:
            "line"
        },


        {
          id: 3,

          prompt:
            "Find customers whose contracts expire in the next 30 days.",

          title:
            "Renewals approaching",

          copy:
            `Upcoming contract dates were matched with active accounts.<br>
            <strong>Contracts:</strong> 8 expiring soon<br>
            <strong>Closest renewal:</strong> 5 days`,

          visual:
            "bars"
        },


        {
          id: 4,

          prompt:
            "Compare active customers by account tier and show the largest group.",

          title:
            "Customer mix identified",

          copy:
            `Active accounts were grouped by their current service tier.<br>
            <strong>Largest group:</strong> Growth<br>
            <strong>Share:</strong> 46% of customers`,

          visual:
            "donut",

          visualValue:
            "46%"
        }

      ],


      workflow: [

        {
          id: 1,

          prompt:
            "When a new customer signs up, create their onboarding tasks and notify the account owner.",

          title:
            "Onboarding started",

          copy:
            `The new account has been assigned a checklist.<br>
            <strong>Tasks created:</strong> 4<br>
            <strong>Owner notified:</strong> Account team`,

          visual:
            "kpi",

          visualValue:
            "4",

          visualLabel:
            "Tasks"
        },


        {
          id: 2,

          prompt:
            "When a support request becomes urgent, assign it to the escalation queue and alert the team.",

          title:
            "Escalation triggered",

          copy:
            `The request was moved into the priority support flow.<br>
            <strong>Queue:</strong> Urgent support<br>
            <strong>Team notified:</strong> Yes`,

          visual:
            "bars"
        },


        {
          id: 3,

          prompt:
            "Create a follow-up task when a customer has not replied within three business days.",

          title:
            "Follow-up scheduled",

          copy:
            `Inactive conversations were checked and the next action was created.<br>
            <strong>Accounts matched:</strong> 7<br>
            <strong>Tasks created:</strong> 7`,

          visual:
            "donut",

          visualValue:
            "7"
        },


        {
          id: 4,

          prompt:
            "After a deal is marked as won, prepare the handover and notify the delivery team.",

          title:
            "Handover prepared",

          copy:
            `The completed deal triggered the delivery handover process.<br>
            <strong>Steps completed:</strong> 3 of 3<br>
            <strong>Delivery team:</strong> Notified`,

          visual:
            "line"
        }

      ],


      apis: [

        {
          id: 1,

          prompt:
            "Check the latest order and delivery status for this customer.",

          title:
            "Order status retrieved",

          copy:
            `The order has shipped and is due tomorrow.<br>
            <strong>Order:</strong> #10482<br>
            <strong>Delivery:</strong> In transit`,

          visual:
            "line"
        },


        {
          id: 2,

          prompt:
            "Get the latest invoice status and outstanding balance for this customer.",

          title:
            "Invoice status retrieved",

          copy:
            `Billing information was retrieved from the connected finance service.<br>
            <strong>Invoice:</strong> #INV-2481<br>
            <strong>Balance:</strong> €1,240 outstanding`,

          visual:
            "kpi",

          visualValue:
            "€1.2k",

          visualLabel:
            "Outstanding"
        },


        {
          id: 3,

          prompt:
            "Check the current service availability and recent incidents for this customer's region.",

          title:
            "Service status checked",

          copy:
            `Live availability data was retrieved for the selected region.<br>
            <strong>Availability:</strong> 99.98%<br>
            <strong>Open incidents:</strong> 1`,

          visual:
            "donut",

          visualValue:
            "99.98%"
        },


        {
          id: 4,

          prompt:
            "Retrieve the customer's latest product usage and API activity.",

          title:
            "Usage data retrieved",

          copy:
            `Recent activity was collected from the connected usage service.<br>
            <strong>Requests:</strong> 18,420 this month<br>
            <strong>Change:</strong> +12% month over month`,

          visual:
            "bars"
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


    function createDonut(
      displayValue = "68%"
    ) {

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
        displayValue;


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


    function createKpi(
      displayValue = "84%",
      label = ""
    ) {

      const wrapper =
        document.createElement(
          "div"
        );


      wrapper.className =
        "chart-kpi";


      const value =
        document.createElement(
          "div"
        );


      value.className =
        "chart-kpi-value";


      value.textContent =
        displayValue;


      wrapper.appendChild(
        value
      );


      if (label) {

        const labelElement =
          document.createElement(
            "div"
          );


        labelElement.className =
          "chart-kpi-label";


        labelElement.textContent =
          label;


        wrapper.appendChild(
          labelElement
        );

      }


      return wrapper;

    }


    function renderVisual(
      variation
    ) {

      resultVisual.innerHTML =
        "";


      let visual;


      switch (
        variation.visual
      ) {

        case "bars":

          visual =
            createBars();

          break;


        case "donut":

          visual =
            createDonut(
              variation.visualValue
            );

          break;


        case "line":

          visual =
            createLine();

          break;


        case "kpi":

          visual =
            createKpi(
              variation.visualValue,
              variation.visualLabel
            );

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
       PROMPT TYPING
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
              10,
              duration /
              text.length
            );


          let index =
            0;


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
        experience
          .getBoundingClientRect();


      const rect =
        element
          .getBoundingClientRect();


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
        experience
          .getBoundingClientRect();


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
       RESULT
       ============================================================ */

    function showResult(
      variation
    ) {

      resultTitle.textContent =
        variation.title;


      resultCopy.innerHTML =
        variation.copy;


      renderVisual(
        variation
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
            item ===
            button;


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
       FOIL MOUSE RESPONSE
       ============================================================ */

    experience.addEventListener(
      "mousemove",
      event => {

        const rect =
          resultCard
            .getBoundingClientRect();


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

    let dots =
      [];


    const mouse = {
      x: -1000,
      y: -1000
    };


    function createDots(
      width,
      height
    ) {

      dots =
        [];


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
        window.devicePixelRatio ||
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
       EVENTS
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