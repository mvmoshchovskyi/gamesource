import { defineStore } from 'pinia';
import router from '@/router';
import { AUTH, DB } from '@/utils/firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import errorCodes from "@/utils/fbcodes.js";

const DEFAULT_USER = {
    uid: null,
    email: null,
    firstname: null,
    lastname: null,
    isAdmin: false,
}
export const useUserStore = defineStore('user', {
    state: () => ({
        loading: false,
        user: DEFAULT_USER,
        auth: false,
    }),
    getters: {},
    actions: {
        setUser(user) {
            this.user = { ...this.user, ...user };
            this.auth = true;
        },
        async signOut(uid){
            await signOut(AUTH);
            this.user = DEFAULT_USER;
            this.auth = false;
            await router.push({ name: 'home' });
        },
        async autosignin(uid){
            try {
                const userData = await this.getUser(uid);
                this.setUser(userData);
                return true;
            } catch (e) {
                console.log(e);
            }
        },
        async getUserProfile(uid) {
            try {
                const userRef = await getDoc(doc(DB, 'users', uid));
                if (!userRef) {
                    throw new Error('Could not find user');
                }
                return userRef.data();
            } catch (e) {
                throw new Error(errorCodes(e.code));
            }
        },
        async signIn(formData) {
            try {
                this.loading = true;

                const response = await signInWithEmailAndPassword(
                    AUTH,
                    formData.email,
                    formData.password
                );

                const userData = await this.getUserProfile(response.user.uid);

                this.setUser(userData);

                await router.push({ name: 'dashboard' });
            } catch (e) {
                throw new Error(errorCodes(e.code));
            } finally {
                this.loading = false;
            }
        },
        async register(formData) {
            try {
                this.loading = true;

                const response = await createUserWithEmailAndPassword(
                    AUTH,
                    formData.email,
                    formData.password
                );

                const newUser = {
                    uid: response.user.uid,
                    email: response.user.email,
                    isAdmin: false
                }

                await setDoc(doc(DB, 'users', response.user.uid), newUser);

                this.setUser(newUser);

                await router.push({ name: 'dashboard' });
            } catch (e) {
                throw new Error(errorCodes(e.code));
            } finally {
                this.loading = false;
            }
        }
    },
})
