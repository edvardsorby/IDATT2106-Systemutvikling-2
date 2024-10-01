import {describe, it, expect, afterEach} from 'vitest'
import { createRouter, createWebHistory } from 'vue-router';
import { mount } from '@vue/test-utils'

import UserComponent from '../../src/components/UserComponent.vue'
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

describe('User component tests', () => {
    const router = createRouter({
        history: createWebHistory(),
        routes: [
        {
            path: '/user',
            name: 'chooseUser',
        },
        {
            path: '/fridge',
            name: 'Fridge',
        }
        ],
    });

    const mock = new MockAdapter(axios);

    afterEach(() => {
        mock.reset();
    });
    it('initializes with name and type text', () => {
        const wrapper = mount(UserComponent, {
            global: {
                plugins: [router],
            },
        });
        router.push({ name: 'chooseUser' });
        expect(wrapper.find('#name').exists()).toBe(true)
        expect(wrapper.find("#type").exists()).toBe(true)
    })

    it('validates the pin input', () => {
        const wrapper = mount(UserComponent, {
            global: {
                plugins: [router],
            },
        });
        router.push({ name: 'chooseUser' });
        wrapper.vm.checkPin('1234')
        expect(wrapper.vm.pinCheck).toBe(true)
        expect(wrapper.vm.checkPin('11')).toBe('PIN must be 4 digits and cannot start with 0.')
    })

    it('should delete subuser and emit update-users event', async () => {
        const id = 123;
        const mockAxios = new MockAdapter(axios);
        mockAxios.onDelete(`http://localhost:8080/api/subusers/deleteSubUser/${id}`).reply(204);
        const wrapper = mount(UserComponent, {
            global: {
                plugins: [router],
            },
            props: {
                id,
            },
        });
        router.push({ name: 'chooseUser' });
        await wrapper.vm.deleteSubuser();

        expect(mockAxios.history.delete.length).toBe(1);
        expect(wrapper.emitted('update-users')).toBeTruthy();
    });

    it('redirects to the fridge page when pin check passes', async () => {
        const wrapper = mount(UserComponent, {
            global: {
                plugins: [router],
            },
        });

        mock.onPost('http://localhost:8080/api/subusers/validatePinCode').reply(config => {
            const { id, pinCode } = JSON.parse(config.data)

            if (id === 1 && pinCode === 1234) {
                return [200, "Pin code is correct" ]
            } else {
                return [404, 'Pin code is not correct']
            }
        })

        await wrapper.setData({ id: 1, pinCode: 1234, name: 'John', type: 'super' });
        await wrapper.vm.chooseSuperUser();
    });

    it('saves info when beta user and show dialog if not', async () => {
        const wrapper = mount(UserComponent, {
            global: {
                plugins: [router],
            },
        });
        await router.push("/user");
        await wrapper.setData({ name: 'Test User', type: false });

        await wrapper.vm.chooseUser();

        expect(localStorage.getItem("userType")).toBe('false')
        wrapper.vm.type = true
        await wrapper.vm.chooseUser();
    });

    it('should set betaUser variable correct ', async () => {
        const wrapper = mount(UserComponent, {
            global: {
                plugins: [router],
            },
        });
        localStorage.setItem("userType", "false")
        await wrapper.vm.setUserLevel()
        expect(wrapper.vm.isChildUser).toBe(true)

        localStorage.setItem("userType", "true")
        await wrapper.vm.setUserLevel()
        expect(wrapper.vm.isChildUser).toBe(false)

    });

    it('set correct edit variable value ', () => {
        const wrapper = mount(UserComponent, {
            global: {
                plugins: [router],
            },
        });
        wrapper.vm.showEditingWindow = false
        wrapper.vm.editInfo()
        expect(wrapper.vm.showEditingWindow).toBe(true)
    });

    it('check update user method ', () => {
        const wrapper = mount(UserComponent, {
            global: {
                plugins: [router],
            },
        });

        wrapper.vm.newName = "John"
        wrapper.vm.newType = "Adult"
        wrapper.vm.pinCode = 1234
        wrapper.vm.updateUser()
        expect(wrapper.vm.typeToSend).toBe(true)
    });
})
