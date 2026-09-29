document.addEventListener("DOMContentLoaded", () => {
  const experience = document.getElementById("experience");
  const ondeva = document.getElementById("ondeva");
  const capabilityButtons = [...document.querySelectorAll(".capability")];
  const agentNode = document.getElementById("agentNode");
  const agentToggle = document.getElementById("agentToggle");
  const agentWrap = document.getElementById("agentWrap");
  const promptText = document.getElementById("promptText");
  const promptCursor = document.getElementById("promptCursor");
  const resultCard = document.getElementById("resultCard");
  const resultTitle = document.getElementById("resultTitle");
  const resultMessage = document.getElementById("resultMessage");
  const metricOne = document.getElementById("metricOne");
  const metricOneValue = document.getElementById("metricOneValue");
  const metricTwo = document.getElementById("metricTwo");
  const metricTwoValue = document.getElementById("metricTwoValue");
  const connections = document.getElementById("connections");

  const requiredElements = [
    experience,
    ondeva,
    agentNode,
    agentToggle,
    agentWrap,
    promptText,
    promptCursor,
    resultCard,
    resultTitle,
    resultMessage,
    metricOne,
    metricOneValue,
    metricTwo,
    metricTwoValue,
    connections
  ];

  if (requiredElements.some(element => !element) || capabilityButtons.length === 0) {
    console.error("Ondeva demo: one or more required elements are missing from index.html.");
    return;
  }

  let selectedCapability = null;
  let agentEnabled = true;
  let runId = 0;
  let resultTimer = null;
  let resizeFrame = null;

  const capabilityData = {
    database: {
      prompt: "Analyze the latest connected data and return the key insight.",
      direct: {
        title: "Data connected",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.",
        one: "Lorem ipsum",
        valueOne: "Lorem",
        two: "Lorem ipsum",
        valueTwo: "Lorem"
      },
      agent: {
        title: "Insight generated",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.",
        one: "Lorem ipsum",
        valueOne: "Lorem",
        two: "Lorem ipsum",
        valueTwo: "Lorem"
      }
    },
    workflow: {
      prompt: "Run the relevant workflow using the available business context.",
      direct: {
        title: "Workflow ready",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.",
        one: "Lorem ipsum",
        valueOne: "Lorem",
        two: "Lorem ipsum",
        valueTwo: "Lorem"
      },
      agent: {
        title: "Workflow executed",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.",
        one: "Lorem ipsum",
        valueOne: "Lorem",
        two: "Lorem ipsum",
        valueTwo: "Lorem"
      }
    },
    apis: {
      prompt: "Use the connected API to retrieve the required information.",
      direct: {
        title: "API connected",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.",
        one: "Lorem ipsum",
        valueOne: "Lorem",
        two: "Lorem ipsum",
        valueTwo: "Lorem"
      },
      agent: {
        title: "API task completed",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.",
        one: "Lorem ipsum",
        valueOne: "Lorem",
        two: "Lorem ipsum",
        valueTwo: "Lorem"
      }
    }
  };

  function point(element, side) {
    const containerRect = experience.getBoundingClientRect();
    const rect = element.getBoundingClientRect();

    let x = rect.left - containerRect.left + rect.width / 2;

    if (side === "left") x = rect.left - containerRect.left;
    if (side === "right") x = rect.right - containerRect.left;

    return {
      x,
      y: rect.top - containerRect.top + rect.height / 2
    };
  }

  function makePath(start, end, className) {
    const ns = "http://www.w3.org/2000/svg";
    const path = document.createElementNS(ns, "path");
    const distance = Math.max(30, Math.abs(end.x - start.x) * 0.42);

    path.setAttribute("class", className);
    path.setAttribute(
      "d",
      `M ${start.x} ${start.y} C ${start.x + distance} ${start.y}, ${end.x - distance} ${end.y}, ${end.x} ${end.y}`
    );

    connections.appendChild(path);
    return path;
  }

  function animateDot(path, direct = false, delay = 0) {
    window.setTimeout(() => {
      if (!path.isConnected) return;

      const ns = "http://www.w3.org/2000/svg";
      const dot = document.createElementNS(ns, "circle");
      const length = path.getTotalLength();
      const duration = 420;
      const startedAt = performance.now();

      dot.setAttribute("r", "5");
      dot.setAttribute("class", direct ? "flow-dot direct" : "flow-dot");
      connections.appendChild(dot);

      function frame(now) {
        if (!dot.isConnected || !path.isConnected) return;

        const progress = Math.min(1, (now - startedAt) / duration);
        const position = path.getPointAtLength(length * progress);

        dot.setAttribute("cx", position.x);
        dot.setAttribute("cy", position.y);

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          dot.remove();
        }
      }

      requestAnimationFrame(frame);
    }, delay);
  }

  function drawFlow(animate = false) {
    connections.innerHTML = "";

    if (window.innerWidth <= 950) return;

    const containerRect = experience.getBoundingClientRect();
    connections.setAttribute("viewBox", `0 0 ${containerRect.width} ${containerRect.height}`);

    const ondevaRight = point(ondeva, "right");

    capabilityButtons.forEach(button => {
      const capabilityLeft = point(button, "left");
      const active = button === selectedCapability;
      const path = makePath(
        ondevaRight,
        capabilityLeft,
        active ? "line active" : "line"
      );

      if (animate && active) animateDot(path, false, 0);
    });

    if (!selectedCapability) return;

    const selectedRight = point(selectedCapability, "right");
    const resultLeft = point(resultCard, "left");

    if (!agentEnabled) {
      const direct = makePath(selectedRight, resultLeft, "line direct");
      if (animate) animateDot(direct, true, 260);
      return;
    }

    const agentLeft = point(agentNode, "left");
    const agentRight = point(agentNode, "right");
    const toAgent = makePath(selectedRight, agentLeft, "line active");
    const toResult = makePath(agentRight, resultLeft, "line active");

    if (animate) {
      animateDot(toAgent, false, 260);
      animateDot(toResult, false, 1500);
    }
  }

  function typePrompt(text, id) {
    return new Promise(resolve => {
      promptText.textContent = "";
      promptCursor.hidden = false;

      const totalDuration = 900;
      const interval = Math.max(12, totalDuration / Math.max(text.length, 1));
      let index = 0;

      function typeNext() {
        if (id !== runId) {
          promptCursor.hidden = true;
          resolve();
          return;
        }

        promptText.textContent = text.slice(0, index + 1);
        index += 1;

        if (index < text.length) {
          window.setTimeout(typeNext, interval);
        } else {
          promptCursor.hidden = true;
          resolve();
        }
      }

      window.setTimeout(typeNext, 120);
    });
  }

  function showFinalResult(data) {
    resultCard.classList.remove("waiting");
    resultTitle.textContent = data.title;
    resultMessage.textContent = data.message;
    metricOne.textContent = data.one;
    metricOneValue.textContent = data.valueOne;
    metricTwo.textContent = data.two;
    metricTwoValue.textContent = data.valueTwo;
  }

  async function runSequence() {
    if (!selectedCapability) return;

    runId += 1;
    const currentRun = runId;
    const key = selectedCapability.dataset.capability;
    const data = capabilityData[key];

    if (!data) {
      console.error(`Ondeva demo: no data found for capability "${key}".`);
      return;
    }

    window.clearTimeout(resultTimer);

    resultCard.classList.add("waiting");
    resultCard.classList.toggle("no-agent", !agentEnabled);
    promptText.textContent = "";
    promptCursor.hidden = true;

    if (!agentEnabled) {
      resultTitle.textContent = "Processing directly...";
      resultMessage.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
      metricOne.textContent = "—";
      metricOneValue.textContent = "";
      metricTwo.textContent = "—";
      metricTwoValue.textContent = "";

      drawFlow(true);

      resultTimer = window.setTimeout(() => {
        if (currentRun !== runId) return;
        showFinalResult(data.direct);
      }, 900);

      return;
    }

    resultTitle.textContent = "Agent processing...";
    resultMessage.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    metricOne.textContent = "—";
    metricOneValue.textContent = "";
    metricTwo.textContent = "—";
    metricTwoValue.textContent = "";

    drawFlow(true);

    await typePrompt(data.prompt, currentRun);
    if (currentRun !== runId) return;

    resultTimer = window.setTimeout(() => {
      if (currentRun !== runId) return;
      showFinalResult(data.agent);
    }, 550);
  }

  function selectCapability(button) {
    selectedCapability = button;

    capabilityButtons.forEach(item => {
      const isSelected = item === button;
      item.classList.toggle("selected", isSelected);
      item.classList.toggle("dimmed", !isSelected);

      const action = item.querySelector(".capability-action");
      if (action) action.textContent = isSelected ? "✓" : "+";
    });
  }

  capabilityButtons.forEach(button => {
    button.addEventListener("click", () => {
      selectCapability(button);
      runSequence();
    });
  });

  agentToggle.addEventListener("click", event => {
    event.stopPropagation();

    agentEnabled = !agentEnabled;
    runId += 1;
    window.clearTimeout(resultTimer);

    agentWrap.classList.toggle("disabled", !agentEnabled);
    promptText.textContent = "";
    promptCursor.hidden = true;

    const movementStart = performance.now();

    function updateMovement(now) {
      drawFlow(false);

      if (now - movementStart < 470) {
        requestAnimationFrame(updateMovement);
      } else if (selectedCapability) {
        runSequence();
      }
    }

    requestAnimationFrame(updateMovement);
  });

  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => drawFlow(false));
  });

  const firstCapability = capabilityButtons[0];
  selectCapability(firstCapability);

  requestAnimationFrame(() => {
    drawFlow(false);
    runSequence();
  });
});
