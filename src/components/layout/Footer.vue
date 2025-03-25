<template>
    <footer class="footer">
      <div class="copyright">
        © 2025 工作周报系统 版权所有
      </div>
      <div class="tech-info">
        技术支持：blackboy工作室
      </div>
    </footer>
  </template>
  
  <script setup>
  </script>
  
  <style lang="scss" scoped>
  @import '@/styles/variables';
  
  .footer {
    text-align: center;
    padding: 10px 0;
    background-color: $footer-bg;
    color: $text-color-secondary;
    font-size: 0.9rem;
    // position: fixed;
    bottom: 0;
    width: 100%;
  
    .copyright {
      margin-bottom: 0px;
    }
  }
  </style>