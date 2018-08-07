let tab = 1;
let client;
let improvement;

function formatPrices(amount) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "symbol"
  });
}

function showHideArrow(tabNr) {
  const arrow = document.querySelector(".back-arrow i");
  if (tabNr === 1 || tabNr === 4) {
    arrow.style.display = "none";
  } else {
    arrow.style.display = "block";
  }
}

function pcfButtonNavigate(el){
  if(!el) return;

  const buttons = document.querySelectorAll("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", () => {
      // remove active class from current
      const activeSection = document.querySelector("section.active");
      activeSection.classList.remove("active");

      // Set new tab number
      tab++;

      // save value in variable
      if (buttons[i].dataset.client) {
        client = buttons[i].dataset.client;
      }
      if (buttons[i].dataset.improvement) {
        improvement = buttons[i].dataset.improvement;
      }

      // render right section
      let search;
      if (tab === 3) {
        search = `pcf-${improvement}`;
      } else {
        search = `pcf-${tab}`;
      }

      const newSection = document.getElementById(search);
      newSection.classList.add("active");

      showHideArrow(tab);

    });
  }
}

function backArrowFunc(el) {
  if(!el) return;

  const backArrow = document.querySelector(".back-arrow i");

  backArrow.addEventListener("click", () => {
    const activeSection = document.querySelector("section.active");
    activeSection.classList.remove("active");

    tab--;

    let search = `pcf-${tab}`;
    const newSection = document.getElementById(search);
    newSection.classList.add("active");
    showHideArrow(tab);
  });
}

function calcRoi(el) {
  if(!el) return;

  const form = document.querySelectorAll(".pcf-calculate-form");
  for (let i = 0; i < form.length; i++) {
    form[i].addEventListener("submit", e => {
      e.preventDefault();

      let marginimpr = document.getElementById("marge-impr").value;
      let volume = document.getElementById("volume").value;
      let volumeimpr = document.getElementById("volume-impr").value;
      let margin = document.getElementById("margin").value;

      //axios request naar api!
      axios
        .get(
          `/api/v1/calculate-roi?client=${client}&improvement=${improvement}&marginimpr=${marginimpr}&volume=${volume}&volumeimpr=${volumeimpr}&margin=${margin}`
        )
        .then(res => {
          const activeSection = document.querySelector("section.active");
          activeSection.classList.remove("active");
          tab++;
          const newSection = document.getElementById("pcf-roi-table");
          const roiTable = document.querySelector('#pcf-roi-table table tbody');
          const roiNumber = document.querySelector('.roi-numbers');
          const childDivs = roiTable.children;
          const data = res.data;
          for (let i = 0; i < childDivs.length; i++) {
            const feeP = childDivs[i].children[1];
            const modFeeP = res.data[i].fee;
            feeP.innerHTML = `€ ${modFeeP}`;
            const roiP = childDivs[i].children[2];
            const modRoiP = `${Math.floor(res.data[i].roi)}%`;
            roiP.innerHTML = modRoiP;
            const setupP = childDivs[i].children[3];
            const modSetupP = res.data[i].setup;
            setupP.innerHTML = `€ ${modSetupP}`;
          }

          const newP = document.createElement('p');
          newP.innerHTML = `U kunt € ${res.data[0].revenue} meer rendement per jaar halen`;
          roiNumber.appendChild(newP);

          newSection.classList.add("active");
          showHideArrow(tab);
        })
        .catch(err => {
          console.log(err);
        });
      //
    });
  }
}

function roiAgain(el) {
  if(!el) return;

  const button = document.getElementById('calc-roi-again');
  button.addEventListener('click', (e) => {
    e.preventDefault();
    location.reload();
  })
}

export {pcfButtonNavigate, backArrowFunc, calcRoi, roiAgain}