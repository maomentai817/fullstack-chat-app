export const formatMessageTime = (date) => { 
  return new Date(date).toLocaleString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}