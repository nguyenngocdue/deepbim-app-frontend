self.onmessage = async (e) => {
  console.log("[WORKER] Got message:", e.data);
  self.postMessage({ status: "success", result: "Hello from worker!" });
};
