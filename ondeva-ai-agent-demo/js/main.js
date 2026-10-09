document.addEventListener("DOMContentLoaded", () => {

  const experience =
    document.getElementById("experience");

  const agentNode =
    document.getElementById("agentNode");

  const ondevaNode =
    document.getElementById("ondevaNode");

  const capabilityButtons = [
    ...document.querySelectorAll(".capability")
  ];

  const promptText =
    document.getElementById("promptText");

  const promptCursor =
    document.getElementById("promptCursor");

  const resultCard =
    document.getElementById("resultCard");

  const resultTitle =
    document.getElementById("resultTitle");

  const resultCopy =
    document.getElementById("resultCopy");

  const resultVisual =
    document.getElementById("resultVisual");

  const connections =
    document.getElementById("connections");

  const canvas =
    document.getElementById("proximityCanvas");

  const ctx =
    canvas.getContext("2d");


  let selectedCapability = null;
  let currentRun = 0;

  const lastVariation = {
    database: null,
    workflow: null,
    apis: null
  };


  /* ============================================================
     DATA
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
          "attention"
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
          "signupTrend"
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
          "renewals"
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
          "customerMix"
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
          "checklist"
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
          "escalation"
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
          "followUp"
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
          "handover"
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
          "delivery"
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
          "invoice"
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
          "availability"
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
          "apiUsage"
      }

    ]

  };


  /* ============================================================
     RANDOM
     ============================================================ */

  function getVariation(capability) {

    const options =
      data[capability];

    const previous =
      lastVariation[capability];

    let candidates =
      options.filter(
        option =>
          option.id !== previous
      );

    if (!candidates.length) {
      candidates = options;
    }

    const randomIndex =
      Math.floor(
        Math.random() *
        candidates.length
      );

    const choice =
      candidates[randomIndex];

    lastVariation[capability] =
      choice.id;

    return choice;

  }


  /* ============================================================
     VISUAL WRAPPER
     ============================================================ */

  function visualWrapper(className) {

    const wrapper =
      document.createElement("div");

    wrapper.className =
      `result-graphic ${className}`;

    return wrapper;

  }


  /* ============================================================
     DATABASE — ATTENTION
     ============================================================ */

  function createAttention() {

    const wrapper =
      visualWrapper(
        "visual-attention"
      );

    wrapper.innerHTML = `
      <div class="attention-users">
        <div class="attention-user">JD</div>
        <div class="attention-user">AM</div>
        <div class="attention-user">KL</div>
      </div>

      <div class="attention-count">
        3
      </div>

      <div class="visual-caption">
        Need attention
      </div>
    `;

    return wrapper;

  }


  /* ============================================================
     DATABASE — SIGNUPS
     ============================================================ */

  function createSignupTrend() {

    const wrapper =
      visualWrapper(
        "visual-signups"
      );

    wrapper.innerHTML = `
      <svg
        viewBox="0 0 250 110"
        aria-hidden="true"
      >

        <path
          class="trend-area"
          d="
            M8 90
            C35 82 45 75 63 76
            C84 77 93 61 111 62
            C134 63 143 50 162 48
            C181 46 192 38 211 39
            C226 40 235 25 242 19
            L242 105
            L8 105
            Z
          "
        />

        <path
          class="trend-line"
          d="
            M8 90
            C35 82 45 75 63 76
            C84 77 93 61 111 62
            C134 63 143 50 162 48
            C181 46 192 38 211 39
            C226 40 235 25 242 19
          "
        />

        <circle cx="63" cy="76" r="4"/>
        <circle cx="111" cy="62" r="4"/>
        <circle cx="162" cy="48" r="4"/>
        <circle cx="211" cy="39" r="4"/>
        <circle cx="242" cy="19" r="4"/>

      </svg>

      <div class="trend-labels">
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span>Jul</span>
        <span>Aug</span>
        <span>Sep</span>
      </div>
    `;

    return wrapper;

  }


  /* ============================================================
     DATABASE — RENEWALS
     ============================================================ */

  function createRenewals() {

    const wrapper =
      visualWrapper(
        "visual-renewals"
      );

    wrapper.innerHTML = `
      <div class="calendar-icon">
        <strong>5</strong>
        <small>days</small>
      </div>

      <div class="visual-side-copy">
        <strong>8 contracts</strong>
        <span>Expiring within 30 days</span>
      </div>
    `;

    return wrapper;

  }


  /* ============================================================
     DATABASE — CUSTOMER MIX
     ============================================================ */

  function createCustomerMix() {

    const wrapper =
      visualWrapper(
        "visual-customer-mix"
      );

    wrapper.innerHTML = `
      <div class="mix-ring">
        <div class="mix-center">
          <strong>46%</strong>
          <span>Growth</span>
        </div>
      </div>
    `;

    return wrapper;

  }


  /* ============================================================
     WORKFLOW — CHECKLIST
     ============================================================ */

  function createChecklist() {

    const wrapper =
      visualWrapper(
        "visual-checklist"
      );

    wrapper.innerHTML = `
      <div class="checklist-icon">

        <div class="checklist-row">
          <span class="checklist-box">✓</span>
          <span class="checklist-line"></span>
        </div>

        <div class="checklist-row">
          <span class="checklist-box">✓</span>
          <span class="checklist-line"></span>
        </div>

        <div class="checklist-row">
          <span class="checklist-box">✓</span>
          <span class="checklist-line"></span>
        </div>

        <div class="checklist-row">
          <span class="checklist-box">✓</span>
          <span class="checklist-line"></span>
        </div>

      </div>

      <div class="visual-side-copy">
        <strong>4 / 4</strong>
        <span>Tasks created</span>
      </div>
    `;

    return wrapper;

  }


  /* ============================================================
     WORKFLOW — ESCALATION
     ============================================================ */

  function createEscalation() {

    const wrapper =
      visualWrapper(
        "visual-escalation"
      );

    wrapper.innerHTML = `
      <div class="escalation-icon">
        !
      </div>

      <div class="visual-side-copy">
        <strong>Urgent support</strong>
        <span>Team notified</span>
      </div>
    `;

    return wrapper;

  }


  /* ============================================================
     WORKFLOW — FOLLOW UP
     ============================================================ */

  function createFollowUp() {

    const wrapper =
      visualWrapper(
        "visual-follow-up"
      );

    wrapper.innerHTML = `
      <div class="follow-icon">

        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="8"
          />

          <path
            d="
              M12 7
              V12
              L15 14
            "
          />

          <path
            d="
              M19 5
              V9
              H15
            "
          />
        </svg>

      </div>

      <div class="visual-side-copy">
        <strong>7 follow-ups</strong>
        <span>Scheduled</span>
      </div>
    `;

    return wrapper;

  }


  /* ============================================================
     WORKFLOW — HANDOVER
     ============================================================ */

  function createHandover() {

    const wrapper =
      visualWrapper(
        "visual-handover"
      );

    wrapper.innerHTML = `
      <div class="handover-flow">

        <span class="handover-step">
          ✓
        </span>

        <span class="handover-line"></span>

        <span class="handover-step">
          ✓
        </span>

        <span class="handover-line"></span>

        <span class="handover-step">
          ✓
        </span>

      </div>

      <div class="visual-caption">
        Handover complete
      </div>
    `;

    return wrapper;

  }


  /* ============================================================
     API — DELIVERY
     ============================================================ */

  function createDelivery() {

    const wrapper =
      visualWrapper(
        "visual-delivery"
      );

    wrapper.innerHTML = `
      <div class="delivery-icon">

        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="
              M3 6
              H14
              V16
              H3
              Z
            "
          />

          <path
            d="
              M14 9
              H18
              L21 12
              V16
              H14
              Z
            "
          />

          <circle
            cx="7"
            cy="18"
            r="2"
          />

          <circle
            cx="18"
            cy="18"
            r="2"
          />
        </svg>

      </div>

      <div class="delivery-route">

        <span class="delivery-route-dot"></span>

        <span class="delivery-route-line"></span>

        <svg
          class="delivery-arrow"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="
              M9 18
              L15 12
              L9 6
            "
          />
        </svg>

      </div>

      <div class="visual-caption">
        In transit
      </div>
    `;

    return wrapper;

  }


  /* ============================================================
     API — INVOICE
     ============================================================ */

  function createInvoice() {

    const wrapper =
      visualWrapper(
        "visual-invoice"
      );

    wrapper.innerHTML = `
      <div class="invoice-icon">

        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="
              M6 3
              H15
              L19 7
              V21
              H6
              Z
            "
          />

          <path
            d="
              M15 3
              V7
              H19
            "
          />

          <path d="M9 11H16"/>
          <path d="M9 15H16"/>
          <path d="M9 18H13"/>
        </svg>

      </div>

      <div class="visual-side-copy">
        <strong>€1,240</strong>
        <span>Outstanding</span>
      </div>
    `;

    return wrapper;

  }


  /* ============================================================
     API — AVAILABILITY
     ============================================================ */

  function createAvailability() {

    const wrapper =
      visualWrapper(
        "visual-availability"
      );

    wrapper.innerHTML = `
      <div class="availability-ring">

        <svg
          viewBox="0 0 120 120"
          aria-hidden="true"
        >
          <circle
            class="availability-track"
            cx="60"
            cy="60"
            r="52"
          />

          <circle
            class="availability-value"
            cx="60"
            cy="60"
            r="52"
          />
        </svg>

        <div class="availability-copy">
          <strong>99.98%</strong>
          <span>Available</span>
        </div>

      </div>
    `;

    return wrapper;

  }


  /* ============================================================
     API — USAGE
     ============================================================ */

  function createApiUsage() {

    const wrapper =
      visualWrapper(
        "visual-api-usage"
      );

    wrapper.innerHTML = `
      <div class="usage-bars">

        <span style="height: 36%"></span>
        <span style="height: 48%"></span>
        <span style="height: 43%"></span>
        <span style="height: 61%"></span>
        <span style="height: 72%"></span>
        <span style="height: 84%"></span>

      </div>

      <div class="usage-copy">

        <strong>
          18.4k
        </strong>

        <span>
          requests
        </span>

        <em>
          ↗ 12%
        </em>

      </div>
    `;

    return wrapper;

  }


  /* ============================================================
     RENDER VISUAL
     ============================================================ */

  function renderVisual(variation) {

    resultVisual.innerHTML = "";

    let visual = null;

    switch (variation.visual) {

      case "attention":
        visual =
          createAttention();
        break;

      case "signupTrend":
        visual =
          createSignupTrend();
        break;

      case "renewals":
        visual =
          createRenewals();
        break;

      case "customerMix":
        visual =
          createCustomerMix();
        break;

      case "checklist":
        visual =
          createChecklist();
        break;

      case "escalation":
        visual =
          createEscalation();
        break;

      case "followUp":
        visual =
          createFollowUp();
        break;

      case "handover":
        visual =
          createHandover();
        break;

      case "delivery":
        visual =
          createDelivery();
        break;

      case "invoice":
        visual =
          createInvoice();
        break;

      case "availability":
        visual =
          createAvailability();
        break;

      case "apiUsage":
        visual =
          createApiUsage();
        break;

    }

    if (visual) {

      resultVisual.appendChild(
        visual
      );

    }

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
            10,
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
     FLOW HELPERS
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


        function frame(now) {

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
              length * progress
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


    if (animate) {

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
     RUN
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
     SELECT
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
     FOIL
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
     CANVAS
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
          ) * .13;

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

});

/* ============================================================
   SECTION 02 — AI AGENT / ONDEVA: ENTRADA AUTOMÁTICA
   Adição independente. Código original acima preservado.
   Seleciona somente [data-od-flow]; não utiliza .capability.
   ============================================================ */

/* Automatic, one-time reveal. No clicks, hover effects, or dependencies. */
(() => {
  'use strict';
  function initAgentFlow() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const readTiming = (value, fallback) => {
    if (value === undefined || value.trim() === '') return fallback;
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? number : fallback;
  };

  document.querySelectorAll('[data-od-flow]').forEach((flow) => {
    if (reducedMotion.matches || flow.classList.contains('od-animated')) return;
    const step = readTiming(flow.dataset.stepMs, 700);
    const start = readTiming(flow.dataset.startMs, 180);
    const cards = flow.querySelectorAll('[data-od-reveal]');
    const connectors = flow.querySelectorAll('[data-od-connector]');
    cards.forEach((card, index) => card.style.setProperty('--od-delay', `${start + index * step}ms`));
    connectors.forEach((arrow, index) => arrow.style.setProperty('--od-delay', `${start + index * step + step * 0.65}ms`));
    flow.classList.add('od-animated');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => flow.classList.add('od-playing'));
    });
    // Respond if the user changes their motion preference while the page is open.
    reducedMotion.addEventListener('change', (event) => {
      if (event.matches) flow.classList.remove('od-animated', 'od-playing');
    });
  });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAgentFlow, { once: true });
  } else {
    initAgentFlow();
  }
})();


/* ============================================================
   SECTION 03 — ANIMAÇÃO AO ENTRAR NA TELA
   Entrada única. Preserva as interações das outras sections.
   ============================================================ */
(() => {
  'use strict';
  function initTrustSections() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    document.querySelectorAll('[data-trust-section]').forEach((section) => {
      if (section.dataset.trustInitialized === 'true') return;
      section.dataset.trustInitialized = 'true';
      const items = section.querySelectorAll('[data-trust-reveal]');
      const counter = section.querySelector('[data-trust-count]');
      let observer = null;
      let started = false;
      let counterTimer = null;
      let frame = null;

      items.forEach((item, index) => {
        item.style.setProperty('--trust-delay', `${index * 130}ms`);
      });

      function finishImmediately() {
        started = true;
        if (observer) observer.disconnect();
        clearTimeout(counterTimer);
        if (frame !== null) cancelAnimationFrame(frame);
        section.classList.add('trust-started');
        if (counter) counter.textContent = '5';
      }

      function animateCounter() {
        if (!counter || reducedMotion.matches) return;
        const startTime = performance.now();
        function tick(now) {
          const progress = Math.min(1, (now - startTime) / 1000);
          const value = 5 * (1 - Math.pow(1 - progress, 3));
          counter.textContent = progress === 1 ? '5' : value.toFixed(1);
          if (progress < 1) frame = requestAnimationFrame(tick);
        }
        frame = requestAnimationFrame(tick);
      }

      function start() {
        if (started) return;
        started = true;
        if (observer) observer.disconnect();
        section.classList.add('trust-started');
        if (counter && !reducedMotion.matches) {
          counter.textContent = '0.0';
          const metric = counter.closest('[data-trust-reveal]');
          const delay = metric ? Number.parseFloat(metric.style.getPropertyValue('--trust-delay')) || 0 : 0;
          counterTimer = setTimeout(animateCounter, delay);
        }
      }

      if (reducedMotion.matches) {
        finishImmediately();
      } else {
        section.classList.add('trust-ready');
        if ('IntersectionObserver' in window) {
          observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) start();
          }, { rootMargin: '0px 0px -64px 0px', threshold: 0 });
          observer.observe(section);
        } else {
          start();
        }
      }
      reducedMotion.addEventListener('change', (event) => {
        if (event.matches) finishImmediately();
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrustSections, { once: true });
  } else {
    initTrustSections();
  }
})();
