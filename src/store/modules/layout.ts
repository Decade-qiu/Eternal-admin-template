import { defineStore } from "pinia"
import { ref } from "vue";

const useLayoutStore = defineStore('Layout', () => {
    let fold = ref(false);
    let refresh = ref(true);
    const changeFold = () => {
        fold.value = !fold.value;
    };
    const changeRefresh = () => {
        refresh.value = !refresh.value;
    }
    return {
        fold,
        changeFold,
        refresh,
        changeRefresh
    };
});
//对外暴露小仓库 
export default useLayoutStore;