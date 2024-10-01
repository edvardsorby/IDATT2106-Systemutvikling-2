import {describe, it, expect, afterEach} from 'vitest'
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { mount } from '@vue/test-utils'
import Login from '../../src/components/LoginComponent.vue'
import loginService from "@/services/loginService";
import settingsService from "@/services/settingsService";

describe('Login page', () => {
    const mock = new MockAdapter(axios);

    afterEach(() => {
        mock.reset();
    });

    it('renders the form with email and password fields', () => {
        const wrapper = mount(Login)
        expect(wrapper.find('#email-input').exists()).toBe(true)
        expect(wrapper.find('#password-input').exists()).toBe(true)
    })

    it('renders the form with login and register buttons', () => {
        const wrapper = mount(Login)
        expect(wrapper.find('#login-radiobutton').exists()).toBe(true)
        expect(wrapper.find('#register-radiobutton').exists()).toBe(true)
    })

    it('validates the email input', () => {
        const wrapper = mount(Login)
        wrapper.vm.checkEmail('test@example.com')
        expect(wrapper.vm.emailCheck).toBe(true)
        expect(wrapper.vm.checkEmail('test@example')).toBe('You must enter a valid email.')
    })

    it('validates the password input', () => {
        const wrapper = mount(Login)
        wrapper.vm.checkPassword('password')
        expect(wrapper.vm.passwordCheck).toBe(true)
        expect(wrapper.vm.checkPassword('short')).toBe('Password must be at least 8 characters.')
    })

    it('validates the firstname input', () => {
        const wrapper = mount(Login)
        wrapper.vm.checkFirstName('John')
        expect(wrapper.vm.firstNameCheck).toBe(true)
        expect(wrapper.vm.checkFirstName('')).toBe('First name cannot be empty.')
    })

    it('validates the lastname input', () => {
        const wrapper = mount(Login)
        wrapper.vm.checkLastName('Doe')
        expect(wrapper.vm.lastNameCheck).toBe(true)
        expect(wrapper.vm.checkLastName('')).toBe('Last name cannot be empty.')
    })

    it('validates the phone number input', () => {
        const wrapper = mount(Login)
        wrapper.vm.checkPhoneNumber('12345678')
        expect(wrapper.vm.phoneCheck).toBe(true)
        expect(wrapper.vm.checkPhoneNumber('')).toBe('Number must be 8 digits.')
    })

    it('validates the household input', () => {
        const wrapper = mount(Login)
        wrapper.vm.checkHousehold('5')
        expect(wrapper.vm.householdCheck).toBe(true)
        expect(wrapper.vm.checkHousehold('')).toBe('There must be at least 1 household member.')
    })

    it('validates the age input', () => {
        const wrapper = mount(Login)
        wrapper.vm.checkAge('20')
        expect(wrapper.vm.ageCheck).toBe(true)
        expect(wrapper.vm.checkAge('5')).toBe('You must be between 16-123 years old to use SmartMat.')
    })

    it('validates the pin input', () => {
        const wrapper = mount(Login)
        wrapper.vm.checkPin('1234')
        expect(wrapper.vm.pinCheck).toBe(true)
        expect(wrapper.vm.checkPin('11')).toBe('PIN must be 4 digits and cannot start with 0.')
    })

    it('should login successfully', async () => {
        const wrapper = mount(Login)
        wrapper.vm.email = "test@example.com"
        wrapper.vm.password = "password123"
        const submitButton = wrapper.find('#submit-button');
        await submitButton.trigger('click');

        mock.onPost('http://localhost:8080/api/auth/authenticate').reply(config => {
            const { email, password } = JSON.parse(config.data)

            if (email === 'test@example.com' && password === 'password123') {
                return [200, { token: 'mock_token' }]
            } else {
                return [401, 'Invalid email or password']
            }
        })

        await wrapper.vm.login()
        expect(localStorage.getItem('email')).toBe("test@example.com");

    })

    it('should register successfully', async () => {
        const wrapper = mount(Login)
        const radioButton = wrapper.find('#register-radiobutton');
        await radioButton.trigger('click');

        wrapper.vm.email = "test@example.com"
        wrapper.vm.password = "password123"
        wrapper.vm.firstname = "John"
        wrapper.vm.lastname = "Doe"
        wrapper.vm.phoneNumber = "12345678"
        wrapper.vm.household = "5"
        wrapper.vm.age = "20"

        const submitButton = wrapper.find('#submit-button');
        await submitButton.trigger('click');

        mock.onPost('http://localhost:8080/api/auth/register').reply(config => {
            const { email } = JSON.parse(config.data)

            if (email !== 'test@test.com') {
                return [201, { token: 'mock_token' }]
            } else {
                return [401, 'Email is already in use']
            }
        })

        await wrapper.vm.register()
        expect(localStorage.getItem('email')).toBe("test@example.com");
    })

})
