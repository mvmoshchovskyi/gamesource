<script setup>
import {ref} from "vue";
import {Field, Form} from "vee-validate";
import * as yup from "yup";

const type = ref(false);
const formSchema = yup.object({
  email: yup.string().required("Email is required").email("Not valid email"),
  password: yup.string().min(6).required("Password is required"),

})

function onSubmit(values, {resetForm}) {
  console.log(values)
}

</script>

<template>
  <div class="signin_container">
    <Form @submit.prevent="onSubmit" :validation-schema="formSchema">
      <h1 v-text="!type ? 'Sign in' : 'Register'"></h1>
      <div class="form_group">
        <Field
            name="email"
            :value="'fin@gmail.com'"
            v-slot="{field, errors, errorMessage}"
        >
          <input
              type="text"
              class="form-control"
              placeholder="Enter your Email"
              v-bind="field"
              :class="{'is-invalid' :errors.length > 0 }"
          />
          <div
              v-if="errors.length > 0"
              class="input_alert"
          >
            {{ errorMessage }}
          </div>
        </Field>
      </div>
      <div class="form_group">
        <Field
            name="password"
            :value="'password'"
            v-slot="{field, errors, errorMessage}"
        >
          <input
              type="password"
              class="form-control"
              placeholder="Enter your Password"
              v-bind="field"
              :class="{'is-invalid' :errors.length > 0 }"
          />
          <div
              v-if="errors.length > 0"
              class="input_alert"
          >
            {{ errorMessage }}
          </div>
        </Field>
      </div>

      <button
          class="btn mb-3 btn-block"
          type="submit"
          v-text="!type ? 'Sign in' : 'Register'"
      >
      </button>
      <hr/>
      <div
          class="form_swap"
          @click="type = !type"
      >
        <span v-if="type">
           I want to <b> Sign in</b>
        </span>
        <span v-else>
           I want to <b> Register</b>
        </span>
      </div>
    </Form>
  </div>
</template>

<style scoped>

</style>
