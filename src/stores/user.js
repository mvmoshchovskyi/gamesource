import { defineStore } from "pinia";
import router from '@/router';

import { AUTH, DB } from '@/utils/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import errorCodes from "@/utils/fbcodes";

import { useToast } from "vue-toast-notification";

const $toast = useToast();

const DEFAULT_USER = {
    uid: null,
    email: null,
    firstname: null,
    lastname: null,
    isAdmin: null
}

export const useUserStore = defineStore('user', {
    state: () => ({
        loading: false,
        user: DEFAULT_USER,
        auth: false
    }),
    getters: {
        getUserData(state) {
            return state.user
        },
        getUserId(state) {
            return state.user.uid
        }
    },
    actions: {
        setUser(user) {
            this.user = { ...this.user, ...user };
            this.auth = true;
        },
        async updateProfile(formData) {
            try {
                const userRef = doc(DB, 'users', this.getUserId);
                await updateDoc(userRef, {
                    ...formData
                });

                this.setUser(formData);
                $toast.success('Updated !!!')
                return true;
            } catch (error) {
                $toast.error(error.message)
            }
        },
        async signOut() {
            await signOut(AUTH);
            this.user = DEFAULT_USER;
            this.auth = false;
            await router.push({ name: 'home' })
        },
        async autosignin(uid) {
            try {
                const userData = await this.getUserProfile(uid);
                /// UPDATE LOCAL STATE
                this.setUser(userData)
                return true;
            } catch (error) {
                console.log(error)
            }
        },
        async getUserProfile(uid) {
            try {
                const userRef = await getDoc(doc(DB, 'users', uid));
                if (!userRef.exists()) {
                    throw new Error('Could not find user !!')
                }
                return userRef.data();
            } catch (error) {
                throw new Error(error)
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

                const userData = await this.getUserProfile(response.user.uid)

                this.setUser(userData);

                await router.push({ name: 'dashboard' })
            } catch (error) {
                throw new Error(errorCodes(error.code))
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

                await router.push({ name: 'dashboard' })
            } catch (error) {
                throw new Error(errorCodes(error.code))
            } finally {
                this.loading = false;
            }
        }
    }
})
