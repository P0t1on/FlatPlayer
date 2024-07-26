<script>
  let progress = 50; // 프로그래스 바의 초기 값
</script>

<div class="progress-container">
  <div class="progress-bar" style="--progress: {progress}%;"></div>
</div>

<input type="range" min="0" max="100" bind:value={progress} />

<style>
  :global(body) {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #000;
    font-family: Arial, sans-serif;
  }

  .progress-container {
    width: 80%;
    background-color: #333;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
  }

  .progress-bar {
    height: 30px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.1) 25%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0.1) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
    width: var(--progress);
    transition: width 0.3s;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
</style>
