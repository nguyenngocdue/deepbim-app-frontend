import React, { useEffect, useRef, useState } from "react";
import * as OBC from "@thatopen/components";
import { worldManager } from "@/services/WorldManager";
import * as WEBIFC from "web-ifc";
import * as BUI from "@thatopen/ui";
import * as FRAGS from "@thatopen/fragments";





const RelationsTree: React.FC = () => {
    useEffect(() => {
        const init = async () => {
            const components = worldManager.getComponents();
            if (!components) return;

            const indexer = components.get(OBC.IfcRelationsIndexer);
            const fragmentsManager = components.get(OBC.FragmentsManager);

            const ifcLoader = components.get(OBC.IfcLoader);
            await ifcLoader.setup();

            // Setup bảng

            fragmentsManager.onFragmentsLoaded.add(async (model) => {
                const projectProps = await model.getAllPropertiesOfType(WEBIFC.IFCPROJECT);
                const rootID = projectProps[119].expressID;
                await indexer.process(model);

                const inverseAttributes = ["IsDecomposedBy", "ContainsElements"];
                const data = await getDecompositionTree(components, model, rootID, inverseAttributes);
                console.log(data);


            });

        };

        init();
    }, []);

    return (
        <div className="flex w-full h-screen ">
            <div className="w-full overflow-auto p-3 text-white text-sm bg-panel-50">

            </div>
            <div className="flex-1" id="viewport" />
        </div>

    );
};

export default RelationsTree;




const getDecompositionTree = async (
    components: OBC.Components,
    model: FRAGS.FragmentsGroup,
    expressID: number,
    inverseAttributes: OBC.InverseAttribute[],
    visited = new Set<number>() // 👈 Add visited set
): Promise<BUI.TableGroupData[]> => {
    const indexer = components.get(OBC.IfcRelationsIndexer);
    const rows: BUI.TableGroupData[] = [];

    if (visited.has(expressID)) return rows; // ❌ Đã xử lý, bỏ qua
    visited.add(expressID); // ✅ Ghi nhớ đã duyệt

    const entityAttrs = await model.getProperties(expressID);
    if (!entityAttrs) return rows;

    const { type } = entityAttrs;
    const row: BUI.TableGroupData = {
        data: {
            Entity: OBC.IfcCategoryMap[type],
            Name: entityAttrs.Name?.value,
            modelID: model.uuid,
            expressID
        }
    };

    for (const attr of inverseAttributes) {
        const relations = indexer.getEntityRelations(model, expressID, attr);
        if (!relations || relations.length === 0) continue;

        if (!row.children) row.children = [];

        for (const childID of relations) {
            const children = await getDecompositionTree(
                components,
                model,
                childID,
                inverseAttributes,
                visited // 👈 truyền lại Set
            );
            row.children.push(...children);
        }
    }

    rows.push(row);
    return rows;
};

