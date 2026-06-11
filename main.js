const Qbox = document.querySelectorAll(".Qbox");
Qbox.forEach(Qbox => {
    Qbox.addEventListener("click", () => {
        const Abox = Qbox.nextElementSibling;
        const icon = Qbox.querySelector(".icon");

        Abox.classList.toggle("open");
        if(Abox.classList.contains("open")){
        icon.textContent = "－";
        }else{
        icon.textContent = "＋";
        }
    });
});