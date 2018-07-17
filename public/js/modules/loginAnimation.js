function animateLogin(el){
  if(!el) return;

  const button = document.querySelector('.login-field form button[type="submit"]');
  console.log(button);
  const form = document.querySelector('.login-field form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    button.innerHTML = '<i class="fal fa-lock-alt"></i>';
    const icon = document.createElement('i');
    setTimeout(() => {
      form.submit();
    }, 1000)
  });
  
};

export {animateLogin}