import { onMounted, onBeforeUnmount, watch, reactive, ref, nextTick } from '@renderer/utils/vueTools'

export default ({ visible, location, onHide }) => {
  const transition1 = 'transform, opacity'
  const transition2 = 'transform, opacity, top, left'
  let show = false
  const dom_menu = ref(null)
  const menuStyles = reactive({
    left: 0,
    top: 0,
    opacity: 0,
    transitionProperty: 'transform, opacity',
    transform: 'scale(0) translate(0,0)',
  })

  const handleShow = () => {
    show = true
    menuStyles.opacity = 1
    menuStyles.transform = `scaleY(1) translate(${handleGetOffsetXY(location.x, location.y)})`
  }
  const handleHide = () => {
    menuStyles.opacity = 0
    menuStyles.transform = 'scale(0) translate(0, 0)'
    show = false
  }
  const handleGetOffsetXY = (left, top) => {
    const listWidth = dom_menu.value.clientWidth
    const listHeight = dom_menu.value.clientHeight
    const dom_container_parant = dom_menu.value.offsetParent
    const containerWidth = dom_container_parant.clientWidth
    const containerHeight = dom_container_parant.clientHeight
    const offsetWidth = containerWidth - left - listWidth
    const offsetHeight = containerHeight - top - listHeight
    let x = 0
    let y = 0
    if (containerWidth > listWidth && offsetWidth < 17) {
      x = offsetWidth - 17
    }
    if (containerHeight > listHeight && offsetHeight < 5) {
      y = offsetHeight - 5
    }
    return `${x}px, ${y}px`
  }
  const handleDocumentClick = (event) => {
    if (!show) return

    if (event.target == dom_menu.value || dom_menu.value.contains(event.target)) return

    if (show && menuStyles.transitionProperty != transition1) menuStyles.transitionProperty = transition1

    onHide()
  }

  watch(visible, visible => {
    visible ? handleShow() : handleHide()
  }, { immediate: true })

  watch(location, location => {
    menuStyles.left = location.x + 2 + 'px'
    menuStyles.top = location.y + 'px'
    nextTick(() => {
      if (show) {
        if (menuStyles.transitionProperty != transition2) menuStyles.transitionProperty = transition2
        menuStyles.transform = `scaleY(1) translate(${handleGetOffsetXY(location.x, location.y)})`
      }
    })
  }, { deep: true })

  onMounted(() => {
    document.addEventListener('click', handleDocumentClick)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleDocumentClick)
  })

  return {
    dom_menu,
    menuStyles,
  }
}
