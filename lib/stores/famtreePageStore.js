import create from "zustand";
import { devtools } from "zustand/middleware";

const famtreePageStore = (set, get) => ({
    drawerOpened: true,
    setDrawerOpened: (val) => set({ drawerOpened: val }),
    activeStep: 0,
    setActiveStep: (step) => set({ activeStep: step }),

    //collab component
    collabActiveStep: 0,
    setCollabActiveStep: (step) => set({ collabActiveStep: step }),
    newCollabToView: null,
    setNewCollabToView: (val) => set({ newCollabToView: val }),
    newCollabChosenMethod: "",
    setNewCollabChosenMethod: (val) => set({ newCollabChosenMethod: val }),

    selectedTreeMember: null,
    setSelectedTreeMember: (member) => set({ selectedTreeMember: member }),
    radioValue: "",
    setRadioValue: (val) => set({ radioValue: val }),
    radioValueError: false,
    setRadioValueError: (val) => set({ radioValueError: val }),
    newRelativeEmail: "",
    setNewRelativeEmail: (val) => set({ newRelativeEmail: val }),
    newRelativeEmailError: false,
    setNewRelativeEmailError: (val) => set({ newRelativeEmailError: val }),
    newRelativeFirstName: "",
    setNewRelativeFirstName: (val) => set({ newRelativeFirstName: val }),
    newRelativeFirstNameError: false,
    setNewRelativeFirstNameError: (val) =>
        set({ newRelativeFirstNameError: val }),
    newRelativeFatherName: "",
    setNewRelativeFatherName: (val) => set({ newRelativeFatherName: val }),
    newRelativeNicknames: "",
    setNewRelativeNicknames: (val) => set({ newRelativeNicknames: val }),
    newRelativeCurrentResidence: "",
    setNewRelativeCurrentResidence: (val) =>
        set({ newRelativeCurrentResidence: val }),
    newRelativeBirthplace: "",
    setNewRelativeBirthplace: (val) => set({ newRelativeBirthplace: val }),
    newRelativeBirthday: null,
    setNewRelativeBirthday: (val) => set({ newRelativeBirthday: val }),
    newRelativeChosenMethod: "",
    setNewRelativeChosenMethod: (val) => set({ newRelativeChosenMethod: val }),
    newRelativeSearchResults: null,
    setNewRelativeSearchResults: (val) =>
        set({ newRelativeSearchResults: val }),
    isSearching: false,
    setIsSearching: (val) => set({ isSearching: val }),
    newRelativeUserToView: null,
    setNewRelativeUserToView: (val) => set({ newRelativeUserToView: val }),
    newRelativeUserToCreate: false,
    setNewRelativeUserToCreate: (val) => set({ newRelativeUserToCreate: val }),
    newRelativeSearchUri: "",
    setNewRelativeSearchUri: (val) => set({ newRelativeSearchUri: val }),
    selectedTreeMemberData: null,
    setSelectedTreeMemberData: (val) => set({ selectedTreeMemberData: val }),
});

const useFamTreePageStore = create(devtools(famtreePageStore));

export default useFamTreePageStore;
