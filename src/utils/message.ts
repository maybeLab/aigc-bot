export const formatEventMessage = (text: string) => {
  try {
    if (text.startsWith("data: ")) {
      const data = text.replace("data: ", "");
      return JSON.parse(data);
    } else {
      throw new Error("Invalid message format");
    }
  } catch (error) {
    throw new Error("decode message error: " + text);
  }
};
