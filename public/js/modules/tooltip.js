function setToolTips(){

  const labels = [...document.querySelectorAll('.tooltip')];

  for(let i=0; i < labels.length; i++){
    const inputContainer = labels[i];
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-container';
    const icon = document.createElement('i');
    icon.className = 'fal fa-info-circle tooltip';
    const tipText = labels[i].dataset.tooltipinfo;
    const span = document.createElement('span');
    span.className = 'tooltip';
    span.innerHTML = tipText;
    const arrow = document.createElement('i');
    arrow.className = 'tooltip-arrow';
    icon.addEventListener('click', () => {
      span.style.display = 'inline-block';
      arrow.style.display = 'inline-block';
      setTimeout(() => {
        span.style.display = 'none';
        arrow.style.display = 'none';
      }, 5000);
    });

    tooltip.appendChild(icon);
    tooltip.appendChild(span);
    tooltip.appendChild(arrow)
    inputContainer.appendChild(tooltip);
  };
};

export default setToolTips;