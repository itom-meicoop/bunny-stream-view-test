// --- API取得部（将来の拡張用に分離） ---
async function fetchVideoInfo(videoId) {
  const res = await fetch(`/api/video/${encodeURIComponent(videoId)}`);
  if (!res.ok) throw new Error('動画情報の取得に失敗しました');
  return await res.json();
}

// --- プレイヤー初期化 ---
function setupPlayer(playlistUrl, resolutions) {
  const video = document.getElementById('video-player');
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(playlistUrl);
    hls.attachMedia(video);
    // 解像度切替UI（将来拡張用）
    // hls.on(Hls.Events.MANIFEST_PARSED, function(event, data) { ... });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = playlistUrl;
  } else {
    document.getElementById('status').textContent = 'このブラウザはHLS再生に対応していません';
  }
  // カスタムコントロール（シークバー等）は必要に応じて追加
}

// --- メイン処理 ---
(async function() {
  const params = new URLSearchParams(location.search);
  const videoId = params.get('videoId');
  if (!videoId) {
    document.getElementById('status').textContent = '動画IDが指定されていません';
    return;
  }

  try {
    const info = await fetchVideoInfo(videoId);
    document.getElementById('video-title').textContent = info.title || '動画';
    if (info.status !== 'ready') {
      document.getElementById('status').textContent = '動画は現在処理中です。しばらくお待ちください。';
      return;
    }
    // サムネイル表示
    const thumb = document.getElementById('video-thumbnail');
    thumb.src = info.thumbnailUrl || '';
    thumb.style.display = 'block';
    thumb.onclick = () => {
      thumb.style.display = 'none';
      document.getElementById('player-container').style.display = 'block';
      setupPlayer(info.playlistUrl, info.availableResolutions);
    };
    // サムネイルクリック前にプレイヤーを表示したい場合は自動で呼ぶ
    // setupPlayer(info.playlistUrl, info.availableResolutions);
  } catch (e) {
    document.getElementById('status').textContent = e.message;
  }
})();
