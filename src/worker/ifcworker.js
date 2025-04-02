importScripts("https://unpkg.com/web-ifc@0.0.68/web-ifc-api.js"); // Load web-ifc trong worker

const ifcApi = new IfcAPI();
ifcApi.SetWasmPath("https://unpkg.com/web-ifc@0.0.68/"); // Đường dẫn đến WASM file

self.onmessage = async (e) => {
  const { buffer } = e.data;

  try {
    await ifcApi.Init(); // Khởi tạo IFC API

    // Mở file IFC từ buffer
    const modelId = ifcApi.OpenModel(buffer);
    const geometry = ifcApi.LoadAllGeometry(modelId); // Lấy geometry
    const properties = ifcApi.GetAllProperties(modelId); // Lấy properties

    // Chuẩn bị dữ liệu để gửi về main thread
    const result = {
      modelId,
      geometry: JSON.stringify(geometry), // Chuyển geometry thành JSON để gửi
      properties: JSON.stringify(properties),
    };

    // Đóng model sau khi xử lý
    ifcApi.CloseModel(modelId);

    // Gửi kết quả về main thread
    self.postMessage({ status: "success", result }, [buffer.buffer]);
  } catch (error) {
    self.postMessage({ status: "error", error: error.message });
  }
};