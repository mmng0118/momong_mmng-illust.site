const illusts = document.querySelectorAll(".illust img");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  illusts.forEach((img) => {
    let move = scrollY * 0.2;
    img.style.transform = `translateY(-${move}px)`;
  });
});
//モーダル-----------------------------------------------
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const modalImg = document.getElementById("modalImg");
const modalTags = document.getElementById("modalTags");
const modalDesc = document.getElementById("modalDesc");
const modalVideo = document.getElementById("modalVideo");
const modalVideoBtn = document.getElementById("modalVideoBtn");
const modalVideoCloseBtn = document.getElementById("modalVideoCloseBtn");

document.querySelectorAll(".card").forEach((card) => {
  const tags = card.dataset.tags ? card.dataset.tags.split(",") : [];
  const captions = card.querySelector(".captions");

  if (captions) {
    captions.innerHTML = `
  <div class="caption--tags">
    ${tags.map((t) => `<span class="caption">${t.trim()}</span>`).join("")}
  </div>
`;
  }

  // モーダル開く
  card.addEventListener("click", () => {
    const src = card.dataset.src || "";
    const desc = card.dataset.desc || "";
    const video = card.dataset.video || "";

    modalImg.src = src;
    modalDesc.textContent = desc;

    modalTags.innerHTML = tags
      .map((t) => `<span class="modal_tag">${t.trim()}</span>`)
      .join("");

    if (video) {
      // 動画あり
      modalVideo.src = video;
      modalVideo.style.display = "none";
      modalVideoBtn.style.display = "block";
      modalVideoCloseBtn.style.display = "none";
    } else {
      // 動画なし
      modalVideo.src = "";
      modalVideo.style.display = "none";
      modalVideoBtn.style.display = "none";
      modalVideoCloseBtn.style.display = "none";
    }

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  });
});
//タイムラプス表示

modalClose.addEventListener("click", () => {
  modal.classList.remove("open");
  document.body.style.overflow = "";

  modalVideo.pause();
  modalVideo.currentTime = 0;
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
});

modalVideoBtn.addEventListener("click", () => {
  modalVideoBtn.style.display = "none";
  modalVideo.style.display = "block";
  modalVideoCloseBtn.style.display = "block";
  modalVideo.play();
});

modalVideoCloseBtn.addEventListener("click", () => {
  modalVideo.pause();
  modalVideo.currentTime = 0;
  modalVideo.load();

  modalVideo.style.display = "none";
  modalVideoBtn.style.display = "block";
  modalVideoCloseBtn.style.display = "none";
});

//ABOUT--------------------------------------------------------------------------
const Qbox = document.querySelectorAll(".Qbox");
Qbox.forEach((Qbox) => {
  Qbox.addEventListener("click", () => {
    const Abox = Qbox.nextElementSibling;
    const icon = Qbox.querySelector(".icon");

    Abox.classList.toggle("open");
    if (Abox.classList.contains("open")) {
      icon.textContent = "－";
    } else {
      icon.textContent = "＋";
    }
  });
});

const meBtns = document.querySelectorAll(".meBtn");
const worksBtns = document.querySelectorAll(".worksBtn");
const toggles = document.querySelectorAll(".toggle-me-works");

meBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".about_me").style.display = "flex";
    document.querySelector(".about_works").style.display = "none";

    requestAnimationFrame(() => {
      toggles.forEach((toggle) => toggle.classList.remove("is-works"));
    });
  });
});

worksBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".about_me").style.display = "none";
    document.querySelector(".about_works").style.display = "flex";

    requestAnimationFrame(() => {
      toggles.forEach((toggle) => toggle.classList.add("is-works"));
    });
  });
});
// --- Canvas設定と描画機能 ------------------------------------------------------
const canvas = document.getElementById("jsCanvas");
const container = document.getElementById("canvasContainer");
const toggle = document.getElementById("modeToggle");
const undoBtn = document.getElementById("undoBtn");

function resizeCanvas() {
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}
resizeCanvas();

const ctx = canvas.getContext("2d");
let painting = false;
const history = [];

history.push(canvas.toDataURL());

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  if (e.touches) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };
  }
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function startPaint(e) {
  e.preventDefault();
  painting = true;
  const pos = getPos(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
  if (toggle.checked) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 20;
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 3;
  }
}

function draw(e) {
  if (!painting) return;
  e.preventDefault();
  const pos = getPos(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function stopPaint() {
  if (!painting) return;
  painting = false;
  ctx.beginPath();
  // ストローク完了後に保存
  history.push(canvas.toDataURL());
  if (history.length > 50) history.shift();
}

canvas.addEventListener("mousedown", startPaint);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopPaint);
canvas.addEventListener("mouseleave", stopPaint);
canvas.addEventListener("touchstart", startPaint, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", stopPaint);

// 取り消しボタン
undoBtn.addEventListener("click", () => {
  if (history.length <= 1) return;
  history.pop();
  const img = new Image();
  img.src = history[history.length - 1];
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(img, 0, 0);
  };

  // アニメーション
  undoBtn.classList.remove("spin");
  void undoBtn.offsetWidth;
  undoBtn.classList.add("spin");
  setTimeout(() => {
    undoBtn.querySelector("i").style.transition = "none";
    undoBtn.classList.remove("spin");
    requestAnimationFrame(() => {
      undoBtn.querySelector("i").style.transition = "";
    });
  }, 380);
});

document.querySelector(".message_btn").addEventListener("click", () => {
  document.querySelector("#form").classList.remove("hidden");
  document.querySelector(".message_btn").classList.add("hidden");
});

const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // ページ移動をキャンセル

  const formData = new FormData(form);

  fetch(form.action, {
    method: "POST",
    mode: "no-cors",
    body: formData,
  });

  form.reset();
});
