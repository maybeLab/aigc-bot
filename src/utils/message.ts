export const formatEventMessage = (text: string) => {
  try {
    if (text.startsWith("data: ")) {
      const data = text.replace("data: ", "");
      return JSON.parse(data);
    } else {
      throw new Error("Invalid message format");
    }
  } catch (err) {
    if (err instanceof Error) {
      console.warn(err.message + text);
    }
    return { index: -1 };
  }
};
