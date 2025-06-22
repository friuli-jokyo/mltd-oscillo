import { Menu, Submenu } from "@tauri-apps/api/menu";
import { viewRangeStrategy } from "./main";

export async function initMenu() {
    const settingMenu = await Submenu.new({
        text: "設定",
        items: [
            {
                text: "設定",
                action: () => {
                    window.location.href = "#/";
                }
            }
        ]
    });
    const viewMenu = await Submenu.new({
        text: "表示",
        items: [
            {
                text: "イベント期間全表示",
                action: () => {
                    viewRangeStrategy.value = "wholeEvent";
                }
            },
            {
                text: "集計済み期間表示",
                action: () => {
                    viewRangeStrategy.value = "onlyAggregated";
                }
            },
            {
                text: "ズーム表示",
                action: () => {
                    viewRangeStrategy.value = "zoomed";
                }
            }
        ]
    })
    const menu = await Menu.new({
        items: [
            settingMenu,
            viewMenu
        ]
    })
    await menu.setAsAppMenu();
}