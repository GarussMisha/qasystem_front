<template>
  <div class="side-menu" :class="{ 'expanded': isExpanded }">
    <button class="toggle-btn" @click="toggleMenu">
      <i class="icon" :class="isExpanded ? 'icon-close' : 'icon-open'"></i>
    </button>

    <nav class="nav">
      <router-link 
        v-for="item in menuItems" 
        :key="item.name"
        :to="{ name: item.route }"
        class="nav-item"
        active-class="active"
      >
        <i class="nav-icon" :class="item.icon"></i>
        <span class="nav-text">{{ item.name }}</span>
        <span v-if="!isExpanded" class="nav-tooltip">{{ item.name }}</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'SideMenu',
  data() {
    return {
      isExpanded: false,
      menuItems: [
        { name: 'Главная страница', icon: 'icon-home', route: 'Home' },
        { name: 'Информация', icon: 'icon-info', route: 'InfoPage' },
        { name: 'Проекты', icon: 'icon-projects', route: 'ProjectList' },
        { name: 'Дебаг панель', icon: 'icon-debug', route: 'DebugPage' },
        { name: 'Профиль', icon: 'icon-profile', route: 'ProfilePage' }
      ]
    }
  },
  methods: {
    toggleMenu() {
      this.isExpanded = !this.isExpanded
      this.$emit('toggle', this.isExpanded)
    }
  }
}
</script>

<style scoped>
.side-menu {
  --width-collapsed: 50px;
  --width-expanded: 200px;
  --transition: 0.4s ease;
  
  position: fixed;
  left: 0;
  width: var(--width-collapsed);
  height: calc(100vh - 0px);
  background: #8577ffac;
  border-right: 0.1px solid #303030;
  transition: width var(--transition);
  z-index: 1000;
  overflow: hidden;
}

.side-menu.expanded {
  width: var(--width-expanded);
}

.toggle-btn {
  position: absolute;
  top: 10px;
  right: 5px;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
}

.nav {
  padding: 20px 0;
  margin-top: 40px;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #23005a;
  text-decoration: none;
  transition: background 0.2s;
  white-space: nowrap;
}

.nav-item:hover {
  background: #b9b2f8ec;
}

.nav-item.active {
  background: #8f82feec;
}

.nav-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-right: 16px;
}

.nav-text {
  opacity: 0;
  transition: 
    opacity 0.2s,
    transform 0.2s;
  transform: translateX(-10px);
}

.nav-tooltip {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: #333;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  white-space: nowrap;
  margin-left: 10px;
}

.expanded .nav-text {
  opacity: 1;
  transform: translateX(0);
}

.side-menu:not(.expanded) .nav-item:hover .nav-tooltip {
  opacity: 1;
}

/* Иконки меню */
.icon-home{
  background: url('@/assets/icons/home.svg') no-repeat center;
  background-size: contain;
}

.icon-info{
  background: url('@/assets/icons/info.svg') no-repeat center;
  background-size: contain;
}

.icon-profile{
  background: url('@/assets/icons/profile.svg') no-repeat center;
  background-size: contain;
}

.icon-projects{
  background: url('@/assets/icons/projects.svg') no-repeat center;
  background-size: contain;
}

.icon-debug{
  background: url('@/assets/icons/debug.svg') no-repeat center;
  background-size: contain;
}

.icon-close{
  background: url('@/assets/icons/close_menu.svg') no-repeat center;
  background-size: contain;
}

.icon-open{
  background: url('@/assets/icons/open_menu.svg') no-repeat center;
  background-size: contain;
}

.nav-item:hover .nav-icon {
  transform: scale(1.2);
  transition: transform 0.2s;
}

.toggle-btn .icon {
  display: block;
  width: 20px;
  height: 20px;
  min-width: 20px;
}
</style>