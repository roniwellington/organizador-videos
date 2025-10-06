let videos = JSON.parse(localStorage.getItem("videos")) || [];

    function saveVideos() {
      localStorage.setItem("videos", JSON.stringify(videos));
    }

    function convertToEmbedUrl(url) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    function addVideo() {
      const title = document.getElementById("videoTitle").value;
      const channel = document.getElementById("channelName").value;
      const url = document.getElementById("videoUrl").value;
      const category = document.getElementById("category").value;

      if (!url || !title || !channel) return alert("Preencha todos os campos!");

      videos.push({ title, channel, url, category, watched: false });
      saveVideos();
      renderVideos();

      document.getElementById("videoTitle").value = "";
      document.getElementById("channelName").value = "";
      document.getElementById("videoUrl").value = "";
    }

    function toggleWatched(index) {
      videos[index].watched = !videos[index].watched;
      saveVideos();
      renderVideos();
    }

    function deleteVideo(index) {
      videos.splice(index, 1);
      saveVideos();
      renderVideos();
    }

    function clearAllVideos() {
      if (confirm("Tem certeza que deseja excluir todos os vídeos?")) {
        videos = [];
        saveVideos();
        renderVideos();
      }
    }

    function renderProgress() {
      const categories = {};
      videos.forEach(v => {
        if (!categories[v.category]) categories[v.category] = { total: 0, watched: 0 };
        categories[v.category].total++;
        if (v.watched) categories[v.category].watched++;
      });

      const container = document.getElementById("progressContainer");
      container.innerHTML = "";
      for (let cat in categories) {
        const percent = Math.round((categories[cat].watched / categories[cat].total) * 100);
        container.innerHTML += `
          <p>${cat}: ${percent}%</p>
          <div class="progress-bar"><div class="progress" style="width:${percent}%">${percent}%</div></div>
        `;
      }
    }

    function renderVideos() {
      const filter = document.getElementById("filter").value;
      const list = document.getElementById("videoList");
      list.innerHTML = "";

      videos.forEach((v, i) => {
        if (filter && v.category !== filter) return;

        const div = document.createElement("div");
        div.className = "video-item" + (v.watched ? " watched" : "");

        const embedUrl = convertToEmbedUrl(v.url);

        div.innerHTML = `
          <div class="video-player">
            <iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
          </div>
          <div class="video-info">
            <span class="video-title">${v.title}</span>
            <span class="video-meta">Canal: ${v.channel} | Categoria: ${v.category}</span>
          </div>
          <div class="actions">
            <button onclick="toggleWatched(${i})">${v.watched ? 'Desmarcar' : 'Assistido'}</button>
            <button class="delete" onclick="deleteVideo(${i})">🗑️</button>
          </div>
        `;
        list.appendChild(div);
      });

      renderProgress();
    }

    renderVideos();