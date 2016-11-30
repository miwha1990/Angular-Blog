
class MenuProvider {
    $get() {
        return {
            all: () => {return this.menus},
            hideItem: (name) => {
                for (let i = 0; i < this.menus.length; i++) {
                    if (this.menus[i].sref == name) this.menus[i].hidden = true;
                }
            },
            showItem: (name) => {
                for (let i = 0; i < this.menus.length; i++) {
                    if (this.menus[i].sref == name) this.menus[i].hidden = false;
                }
            }
        }
    }
    registerMenu(name, settings ) {
        this.menus.push({sref: name, label: settings.label});
     }
    constructor() {
        this.menus = [];

    }
}

export default MenuProvider;
