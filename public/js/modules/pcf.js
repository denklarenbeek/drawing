let tab = 1;
let client;
let improvement;

function showHideArrow(tabNr) {
  const arrow = document.querySelector(".back-arrow i");
  if (tabNr === 1 || tabNr === 4) {
    arrow.style.display = "none";
  } else {
    arrow.style.display = "block";
  }
}

if (location.pathname === "/pcf") {
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

      console.log(tab, client, improvement);
    });
  }
}

if (location.pathname === "/pcf") {
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

if (location.pathname === "/pcf") {

  const form = document.querySelectorAll(".pcf-calculate-form");
  console.log(form);
  for (let i = 0; i < form.length; i++) {
    form[i].addEventListener("submit", e => {
      e.preventDefault();

      let marginimpr = document.getElementById('marge-impr').value;
      let volume = document.getElementById('volume').value;
      let volumeimpr = document.getElementById('volume-impr').value;;
      let margin = document.getElementById('margin').value;

      //axios request naar api!
      axios.get(`/api/v1/calculate-roi?client=${client}&improvement=${improvement}&marginimpr=${marginimpr}&volume=${volume}&volumeimpr=${volumeimpr}&margin=${margin}`)
        .then(res =>  {
          const activeSection = document.querySelector("section.active");
          activeSection.classList.remove("active");
          tab++
          const newSection = document.getElementById('pcf-roi');
          newSection.classList.add("active");
          showHideArrow(tab);
        })
        .catch(err => {
          console.log(err)
        });
      // 
    });
  }
}


