
/* ===============================
   CINEPHILE CORE SYSTEM
   =============================== */

const Cinephile = {
  user: {
    xp: Number(localStorage.getItem("cine_xp")) || 0,
    level: Number(localStorage.getItem("cine_lvl")) || 1,
  },

  addXP(amount, reason = "") {
    this.user.xp += amount;

    // Leveling system (simple curve)
    const nextLevelXP = this.user.level * 100;
    if (this.user.xp >= nextLevelXP) {
      this.user.xp -= nextLevelXP;
      this.user.level++;
      this.toast(`🎉 LEVEL UP! Level ${this.user.level}`);
    }

    localStorage.setItem("cine_xp", this.user.xp);
    localStorage.setItem("cine_lvl", this.user.level);

    this.toast(`+${amount} XP ${reason}`);
    this.updateHUD();
  },

  updateHUD() {
    const xpBar = document.getElementById("cineXP");
    const lvlText = document.getElementById("cineLevel");
    if (!xpBar || !lvlText) return;

    const maxXP = this.user.level * 100;
    xpBar.style.width = `${(this.user.xp / maxXP) * 100}%`;
    lvlText.innerText = `LV ${this.user.level}`;
  },

  toast(text) {
    const toast = document.createElement("div");
    toast.innerText = text;
    toast.className = `
      fixed bottom-6 right-6
      bg-yellow-400 text-black font-black
      px-5 py-3 rounded-xl shadow-xl
      animate-pop z-50
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  },

  route(path) {
    window.location.href = path;
  }
};

window.Cinephile = {
  data: {
    points: 0,
    xp: 0,
    level: 1
  },

  load() {
    const d = localStorage.getItem("cinephile-core");
    if (d) this.data = JSON.parse(d);
  },

  save() {
    localStorage.setItem("cinephile-core", JSON.stringify(this.data));
  },

  addReward(points = 0, xp = 0, source = "") {
    this.data.points += points;
    this.data.xp += xp;

    // level up
    const need = this.data.level * 200;
    if (this.data.xp >= need) {
      this.data.level++;
      this.data.xp = 0;
    }

    this.save();
    console.log(`[CINEPHILE] +${points} pts, +${xp} XP from ${source}`);
  },

  updateHUD() {
    this.load();
    document.getElementById("cineLevel")?.innerText = "LV " + this.data.level;
    document.getElementById("cineXP")?.style.width =
      (this.data.xp / (this.data.level * 200)) * 100 + "%";
  },

  route(file) {
    window.location.href = file;
  }
};

Cinephile.load();