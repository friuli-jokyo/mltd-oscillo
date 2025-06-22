import { Menu, Submenu } from "@tauri-apps/api/menu";

export async function initMenu() {
    const settingMenu = await Submenu.new({
        text: "Settings",
        items: [
            {
                text: "Preferences",
                action: () => {
                    window.location.href = "#/";
                }
            }
        ]
    });
    const menu = await Menu.new({
        items: [
            settingMenu
        ]
    })
    await menu.setAsAppMenu();
}