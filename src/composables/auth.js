import { ref } from "vue";
// import { userService } from "./userService";
import { useUserStore } from "@/stores/user.js";
import { onAuthStateChanged } from "firebase/auth";
import { AUTH } from "@/utils/firebase.js";

export const firstLoad = () => {
    const userStore = useUserStore();
    const loading = ref(true);

    onAuthStateChanged(AUTH, async (user) => {
        if (user) {
            await userStore.autosignin(user.uid);
        }
        loading.value = false;

    })
    return { loading };
}
