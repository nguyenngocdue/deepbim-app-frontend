5.1. ifc-model-service.ts:
Lý do: File này xử lý logic cốt lõi liên quan đến model IFC (thêm, xóa, cập nhật model). Đây là nền tảng để các service khác (như rule-service.ts) hoạt động.
Nội dung cần chú ý:
Các hàm như addIFCModel, removeIFCModel, setModelIDForLoadedModel.
Cách state (loadedModels) được cập nhật thông qua setLoadedModels.

5.2. rule-service.ts:
Lý do: File này xử lý logic rules, là một phần quan trọng trong việc áp dụng các quy tắc phân loại elements. Nó phụ thuộc vào model data từ ifc-model-service.ts.
Nội dung cần chú ý:
Hàm matchesAllConditionsCallback để kiểm tra điều kiện rule.
Hàm applyAllActiveRules để áp dụng rules lên model.
Hàm previewRuleHighlight để xem trước kết quả rule.

5.3. classification-service.ts:
Lý do: File này quản lý classifications, phụ thuộc vào rules và model. Đọc sau rule-service.ts vì nó sử dụng rules và setRules.
Nội dung cần chú ý:
Các hàm như addClassification, assignClassificationToElement.
Các hàm xuất/nhập (exportRulesAsJson, importRulesFromExcel).
Fix lỗi "rules is not defined" bằng cách truyền rules vào hook.

5.4. element-service.ts:
Lý do: File này xử lý selection và properties của elements, thường được sử dụng sau khi model và classifications đã được thiết lập.
Nội dung cần chú ý:
Các hàm như selectElement, toggleElementSelection, getElementPropertiesCached.

5.5. visibility-service.ts:
Lý do: File này xử lý logic ẩn/hiện elements và models, thường là bước cuối vì nó phụ thuộc vào selection và model data.
Nội dung cần chú ý:
Các hàm như toggleUserHideElement, toggleModelVisibility.