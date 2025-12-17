/**
 * Workflow Module
 *
 * Handles the configurable alert workflow modal, including:
 * - Modal display and minimization
 * - State-machine driven rendering
 * - Clipboard actions and notifications
 * - Timer integrations and confirmation dialogs
 *
 * @module workflow
 */

const WORKFLOW_DEFAULT_STATE = "1";

const WORKFLOW_CONFIG = {
    texts: {
        failure_feedback: `As we conclude our service, we’d like to sincerely thank you for trusting us. We’re sorry that we were unable to rescue you this time. Your health and satisfaction are our top priorities, and we hope that we will be able to assist you in the future if needed. If you have a moment, we’d greatly appreciate it if you could leave a rating and comment on the alert card to let us know how we handled your case today!`,
        service_denial: `Greetings. We regret to inform you that we are currently unable to respond to your emergency for one or more of the following reasons:
• All MEDRUNNER personnel are currently occupied or unavailable.
• Ongoing technical difficulties affect personnel or game functionality.
• Active teams are engaged in priority-level operations and cannot be diverted.
• Your current location falls outside our operational parameters.
We understand this may be frustrating and sincerely apologize for any inconvenience. We encourage you to reach out again in the future, and we will make every effort to assist you as soon as possible.`,
        stand_down_no_contact: `Standing down due to no contact. You're welcome to resubmit, but please know that you will need to be ready to accept friend and party invites and answer the questions in order for us to respond.`,
        warning_close_5min: `Just as fair warning, if we haven't heard from you within the next 5 minutes, we will hope all is well and close this alert.`,
        questions_please_submit: `Hello. Could you please complete the questionnaire and press submit.`,
        no_response_5min_close: `If we do not hear from you within 5 minutes, we will assume all is well and close this alert.`,
        chat_no_team_available: `Thank you for choosing Medrunner Services! We’ve received your alert — no need to worry. All active teams are currently deployed, but one will be assigned to you shortly.!`,
        chat_greetings_template: `Thank you for choosing Medrunner Services! My name is {TEAM_LEAD_NAME}, and I’ll be leading the team dispatched to your location. I will be sending you a friend request and/or party invite. (To accept the invite, make sure you're in first-person view and spam the key to the right of P — typically the [ key, though it may vary depending on your keyboard layout.) Please confirm here when you are ready to receive the invites!

Could you please tell me if you need a Med Bed and if you need Extraction to the NEAREST Station.
Please let me know anytime during this operation if anything changes (for example your medical condition or dangers)`,
        chat_friend_request_sent: `Friend Request sent, please spam the accept key!`,
        chat_party_invite_sent: `Party Invite sent, please spam the accept key!`,
        chat_joining_server: `Perfect! Our Team is joining your Server now. I will notify you when we are shortly arriving.`,
        chat_server_full: `Our Team is joining your Server now. I will notify you when we are shortly arriving.
Do note your server is full, there may be a short delay. I apologize for this in advance.`,
        chat_left_station_switch_party: `Depending on the situation, we may not pick you up immediately. Please be patient while we secure the area. We will reach you soon. Switching over to in-game party chat now. Note: If you are downed, it will be harder to read until you are revived.`,
        chat_closing_in: `Our Team is close to you location. We will arrive soon.`,
        chat_we_arrived_station: `We arrived at the Station, you are good to go now. Please leave the ship.`,
        chat_end_and_feedback: `As we conclude our service, we’d like to sincerely thank you for trusting us. We hope today’s response was prompt, professional, and met your expectations. Your health and satisfaction are our top priorities, and we hope to assist you again in the future if needed.

If you have a moment, we’d greatly appreciate it if you could leave a rating and comment on the alert card to let us know how we did today!`,
        confirm_end_mission: `Are you sure you wanna end the Mission? Please send the End and Feedback text first to the Client before you confirm.`,
        confirm_stand_down: `Are you sure you want to stand down and close this alert due to no contact?`,
        confirm_failure_end: `Are you sure you want to end this mission as a failure and close the alert?`,
        chat_extraction_nearest_station: `We will bring you safely to nearest Station. Please stay close to our team and do not go anywhere else, because it may pose a risk to your safety. The Team will bring you in the ship and will show you where to sit or lay down during the flight. Please do not leave this place during the flight or open your Mobiglass unless the team tells you to do so.
We will let you know when we arrive.`,
        chat_issue_keybinding: `Hmm it was not accepted, is your default accept key the key on the right of P?`,
        chat_spectrum_bugged: `The Friend Request has bugged, this is a known problem. Please can you navigate to https://robertsspaceindustries.com/spectrum to accept the Friend Request.

Please confirm here once you have accepted it.`,
        chat_no_response_generic: `Just as fair warning, if we haven't heard from you within the next 5 minutes, we will hope all is well and close this alert.`,
        input_nearest_station_prompt: `Please fill in the Name of the nearest Station`,
        stand_down_no_contact_copy: `Standing down due to no contact. You're welcome to resubmit, but please know that you will need to be ready to accept friend and party invites and answer the questions in order for us to respond.`,
        chat_no_team_available_copy: `Thank you for choosing Medrunner Services! We’ve received your alert — no need to worry. All active teams are currently deployed, but one will be assigned to you shortly.!`
    },
    states: {
        "1": {
            title: null,
            text: null,
            transitions: [
                {
                    button: "Channel – Set Status Alarm",
                    actions: [
                        {
                            type: "copy",
                            value: `<a:AlertBlue:1064652389711360043><a:AlertRed:985293780288700476><:AA1:1182246601557823520><:AA2:1182246604401561610><:AA3:1182246605718556682><:AA4:1182246607228514304><:AA5:1182246610189692938><:AA6:1182246613150859304><:AA7:1182246614665019393><:AA8:1182246617559072838><a:AlertRed:985293780288700476><a:AlertBlue:1064652389711360043><t:1765930867:R>`
                        },
                        {
                            type: "goto",
                            target: "2"
                        }
                    ]
                }
            ]
        },
        "2": {
            title: "Is there a Dispatcher?",
            text: null,
            transitions: [
                {
                    button: "Without Dispatch",
                    actions: [
                        {
                            type: "goto",
                            target: "3"
                        }
                    ]
                },
                {
                    button: "With Dispatch (Currently no function WIP)",
                    actions: []
                },
                {
                    button: "Back",
                    actions: [
                        {
                            type: "goto",
                            target: "1"
                        }
                    ]
                }
            ]
        },
        "3": {
            title: "Check if Questions were Submitted",
            text: null,
            transitions: [
                {
                    button: "Questions Submitted",
                    actions: [
                        {
                            type: "goto",
                            target: "6"
                        }
                    ]
                },
                {
                    button: "Chat – Please Submit Questions",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "questions_please_submit"
                        },
                        {
                            type: "goto",
                            target: "4"
                        }
                    ]
                },
                {
                    button: "Back",
                    actions: [
                        {
                            type: "goto",
                            target: "2"
                        }
                    ]
                }
            ]
        },
        "4": {
            title: null,
            text: null,
            transitions: [
                {
                    button: "Questions Submitted",
                    actions: [
                        {
                            type: "goto",
                            target: "6"
                        }
                    ]
                },
                {
                    button: "Chat – No Response after 5 Minutes",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "no_response_5min_close"
                        },
                        {
                            type: "goto",
                            target: "5"
                        }
                    ]
                },
                {
                    button: "Back",
                    actions: [
                        {
                            type: "goto",
                            target: "3"
                        }
                    ]
                }
            ]
        },
        "5": {
            title: null,
            text: null,
            transitions: [
                {
                    button: "Questions Submitted",
                    actions: [
                        {
                            type: "goto",
                            target: "6"
                        }
                    ]
                },
                {
                    button: "Chat – Stand Down",
                    actions: [
                        {
                            type: "modal",
                            value: "Are you sure you want to stand down and close this alert due to no contact?"
                        },
                        {
                            type: "copy_ref",
                            ref: "stand_down_no_contact"
                        },
                        {
                            type: "timer_reset"
                        },
                        {
                            type: "close_modal"
                        }
                    ]
                },
                {
                    button: "Back",
                    actions: [
                        {
                            type: "goto",
                            target: "4"
                        }
                    ]
                }
            ]
        },
        "6": {
            title: null,
            text: null,
            transitions: [
                {
                    button: "Chat - No Team available",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "chat_no_team_available"
                        }
                    ]
                },
                {
                    button: "Chat – Service Denial",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "service_denial"
                        },
                        {
                            type: "modal",
                            value: "Are you sure you want to deny service and close the alert?"
                        },
                        {
                            type: "close_modal"
                        }
                    ]
                },
                {
                    button: "Chat - Greetings",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "chat_greetings_template"
                        },
                        {
                            type: "goto",
                            target: "7"
                        }
                    ]
                },
                {
                    button: "Back",
                    actions: [
                        {
                            type: "goto",
                            target: "5"
                        }
                    ]
                }
            ]
        },
        "7": {
            title: null,
            text: null,
            transitions: [
                {
                    button: "Chat - Friend Request",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "chat_friend_request_sent"
                        },
                        {
                            type: "goto",
                            target: "9"
                        }
                    ]
                },
                {
                    button: "Chat – No Response",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "warning_close_5min"
                        },
                        {
                            type: "goto",
                            target: "8"
                        }
                    ]
                },
                {
                    button: "Back",
                    actions: [
                        {
                            type: "goto",
                            target: "6"
                        }
                    ]
                }
            ]
        },
        "8": {
            title: null,
            text: null,
            transitions: [
                {
                    button: "Client Response",
                    actions: [
                        {
                            type: "goto",
                            target: "9"
                        }
                    ]
                },
                {
                    button: "Chat – Stand Down",
                    actions: [
                        {
                            type: "modal",
                            value: "Are you sure you want to stand down and close this alert due to no contact?"
                        },
                        {
                            type: "copy_ref",
                            ref: "stand_down_no_contact_copy"
                        },
                        {
                            type: "timer_reset"
                        },
                        {
                            type: "close_modal"
                        }
                    ]
                },
                {
                    button: "Back",
                    actions: [
                        {
                            type: "goto",
                            target: "7"
                        }
                    ]
                }
            ]
        },
        "9": {
            title: null,
            text: null,
            transitions: [
                {
                    button: "Chat – Party Invite",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "chat_party_invite_sent"
                        },
                        {
                            type: "goto",
                            target: "12"
                        }
                    ]
                },
                {
                    button: "Issue with Invite",
                    actions: [
                        {
                            type: "goto",
                            target: "10"
                        }
                    ]
                },
                {
                    button: "Back",
                    actions: [
                        {
                            type: "goto",
                            target: "8"
                        }
                    ]
                }
            ]
        },
        "10": {
            title: null,
            text: null,
            transitions: [
                {
                    button: "Chat – Check Key Binding",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "chat_issue_keybinding"
                        },
                        {
                            type: "goto",
                            target: "11"
                        }
                    ]
                },
                {
                    button: "Chat – No response",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "chat_no_response_generic"
                        },
                        {
                            type: "goto",
                            target: "8"
                        }
                    ]
                },
                {
                    button: "Back",
                    actions: [
                        {
                            type: "goto",
                            target: "9"
                        }
                    ]
                }
            ]
        },
        "11": {
            title: null,
            text: null,
            transitions: [
                {
                    button: "Chat – Party Invite",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "chat_party_invite_sent"
                        },
                        {
                            type: "goto",
                            target: "12"
                        }
                    ]
                },
                {
                    button: "Chat – Bugged Spectrum needed",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "chat_spectrum_bugged"
                        }
                    ]
                },
                {
                    button: "Back",
                    actions: [
                        {
                            type: "goto",
                            target: "10"
                        }
                    ]
                }
            ]
        },
        "12": {
            title: null,
            text: null,
            transitions: [
                {
                    button: "Chat – Joining Server",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "chat_joining_server"
                        },
                        {
                            type: "goto",
                            target: "13"
                        }
                    ]
                },
                {
                    button: "Chat - Server Full",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "chat_server_full"
                        },
                        {
                            type: "goto",
                            target: "13"
                        }
                    ]
                },
                {
                    button: "Back",
                    actions: [
                        {
                            type: "goto",
                            target: "11"
                        }
                    ]
                }
            ]
        },
        "13": {
            title: null,
            text: null,
            transitions: [
                {
                    button: "Chat – Left Station and switch to Ingame Partychat",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "chat_left_station_switch_party"
                        },
                        {
                            type: "timer_set",
                            value: "Left Station"
                        },
                        {
                            type: "goto",
                            target: "14"
                        }
                    ]
                },
                {
                    button: "Chat – Failure with Feedback",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "failure_feedback"
                        },
                        {
                            type: "modal",
                            value: "Are you sure you want to end this mission as a failure and close the alert?"
                        },
                        {
                            type: "timer_reset"
                        },
                        {
                            type: "close_modal"
                        }
                    ]
                },
                {
                    button: "Back",
                    actions: [
                        {
                            type: "goto",
                            target: "12"
                        }
                    ]
                }
            ]
        },
        "14": {
            title: null,
            text: null,
            transitions: [
                {
                    button: "Chat – Closing in",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "chat_closing_in"
                        },
                        {
                            type: "goto",
                            target: "15"
                        }
                    ]
                },
                {
                    button: "Chat – Failure with Feedback",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "failure_feedback"
                        },
                        {
                            type: "modal",
                            value: "Are you sure you want to end this mission as a failure and close the alert?"
                        },
                        {
                            type: "timer_reset"
                        },
                        {
                            type: "close_modal"
                        }
                    ]
                },
                {
                    button: "Back",
                    actions: [
                        {
                            type: "goto",
                            target: "13"
                        }
                    ]
                }
            ]
        },
        "15": {
            title: null,
            text: null,
            transitions: [
                {
                    button: "Arrive at the Client",
                    actions: [
                        {
                            type: "timer_set",
                            value: "Arrived at Client"
                        },
                        {
                            type: "goto",
                            target: "16"
                        }
                    ]
                },
                {
                    button: "Chat – Failure with Feedback",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "failure_feedback"
                        },
                        {
                            type: "modal",
                            value: "Are you sure you want to end this mission as a failure and close the alert?"
                        },
                        {
                            type: "timer_reset"
                        },
                        {
                            type: "close_modal"
                        }
                    ]
                },
                {
                    button: "Back",
                    actions: [
                        {
                            type: "goto",
                            target: "14"
                        }
                    ]
                }
            ]
        },
        "16": {
            title: null,
            text: null,
            transitions: [
                {
                    button: "Extraction Needed",
                    actions: [
                        {
                            type: "goto",
                            target: "17"
                        }
                    ]
                },
                {
                    button: "No extraction needed and Client safe -> End of Mission",
                    actions: [
                        {
                            type: "goto",
                            target: "19"
                        }
                    ]
                },
                {
                    button: "Chat – Failure with Feedback",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "failure_feedback"
                        },
                        {
                            type: "modal",
                            value: "Are you sure you want to end this mission as a failure and close the alert?"
                        },
                        {
                            type: "timer_reset"
                        },
                        {
                            type: "close_modal"
                        }
                    ]
                },
                {
                    button: "Back",
                    actions: [
                        {
                            type: "goto",
                            target: "15"
                        }
                    ]
                }
            ]
        },
        "17": {
            title: "Nearest Station",
            text: "Please fill in the Name of the nearest Station",
            transitions: [
                {
                    button: "Store Nearest Station",
                    actions: [
                        {
                            type: "store_input",
                            field: "nearest_station"
                        }
                    ]
                },
                {
                    button: "Chat – Extraction to nearest Station",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "chat_extraction_nearest_station"
                        },
                        {
                            type: "goto",
                            target: "18"
                        }
                    ]
                },
                {
                    button: "Chat – Failure with Feedback",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "failure_feedback"
                        },
                        {
                            type: "modal",
                            value: "Are you sure you want to end this mission as a failure and close the alert?"
                        },
                        {
                            type: "timer_reset"
                        },
                        {
                            type: "close_modal"
                        }
                    ]
                },
                {
                    button: "Back",
                    actions: [
                        {
                            type: "goto",
                            target: "16"
                        }
                    ]
                }
            ]
        },
        "18": {
            title: null,
            text: null,
            transitions: [
                {
                    button: "Chat - We arrived at the Station",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "chat_we_arrived_station"
                        },
                        {
                            type: "goto",
                            target: "19"
                        }
                    ]
                },
                {
                    button: "Chat – Failure with Feedback",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "failure_feedback"
                        },
                        {
                            type: "modal",
                            value: "Are you sure you want to end this mission as a failure and close the alert?"
                        },
                        {
                            type: "timer_reset"
                        },
                        {
                            type: "close_modal"
                        }
                    ]
                },
                {
                    button: "Back",
                    actions: [
                        {
                            type: "goto",
                            target: "17"
                        }
                    ]
                }
            ]
        },
        "19": {
            title: null,
            text: null,
            transitions: [
                {
                    button: "Chat – End and Feedback",
                    actions: [
                        {
                            type: "copy_ref",
                            ref: "chat_end_and_feedback"
                        },
                        {
                            type: "modal",
                            value: "Are you sure you wanna end the Mission? Please send the End and Feedback text first to the Client before you confirm"
                        },
                        {
                            type: "alert_status",
                            value: "RTB"
                        },
                        {
                            type: "copy",
                            value: `<:RTB1:1182246669564256296><:RTB2:1182246670717689867><:RTB3:1182246674383507476><:RTB4:1182246677101412392><:RTB5:1182246678397464596><:RTB6:1182246679680929803><:RTB7:1182246686177894430><:RTB8:1182246689336213575><t:1765983625:R>`
                        },
                        {
                            type: "timer_set",
                            value: "RTB"
                        },
                        {
                            type: "close_modal"
                        },
                        {
                            type: "goto",
                            target: "AAR"
                        }
                    ]
                },
                {
                    button: "Back",
                    actions: [
                        {
                            type: "goto",
                            target: "18"
                        }
                    ]
                }
            ]
        }
    }
};

const WORKFLOW_STORAGE_KEYS = {
    CHANNEL_STATUS: "mrs_channel_status"
};

const workflowState = {
    currentStateId: WORKFLOW_DEFAULT_STATE,
    minimized: false,
    storedInputs: {},
    lastChannelStatus: "Standby",
    confirmationResolver: null
};

/**
 * Open the workflow modal
 * @param {Object} options
 * @param {boolean} options.resetState - Reset to default state when opening
 */
function openWorkflowModal({ resetState = true } = {}) {
    const modal = document.getElementById("workflow-modal");
    if (!modal) return;

    modal.classList.remove("hidden");
    modal.classList.add("flex");

    workflowState.minimized = false;
    hideWorkflowMinimizedBar();

    if (resetState) {
        workflowState.currentStateId = WORKFLOW_DEFAULT_STATE;
        workflowState.storedInputs = {};
    }

    renderWorkflowState(workflowState.currentStateId);
}

/**
 * Close the workflow modal
 * @param {Object} options
 * @param {boolean} options.resetState - Reset the stored state when closing
 */
function closeWorkflowModal({ resetState = true } = {}) {
    const modal = document.getElementById("workflow-modal");
    if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }

    hideWorkflowMinimizedBar();

    if (resetState) {
        workflowState.currentStateId = WORKFLOW_DEFAULT_STATE;
        workflowState.storedInputs = {};
        workflowState.minimized = false;
        updateWorkflowMinimizedStepLabel(WORKFLOW_DEFAULT_STATE);
    }
}

/**
 * Minimize the workflow modal
 */
function minimizeWorkflowModal() {
    const modal = document.getElementById("workflow-modal");
    const minimized = document.getElementById("workflow-minimized");
    if (!modal || !minimized) return;

    workflowState.minimized = true;
    modal.classList.add("hidden");
    modal.classList.remove("flex");

    minimized.classList.remove("hidden");
    minimized.classList.add("flex");
}

/**
 * Restore the workflow modal from minimized state
 */
function restoreWorkflowModal() {
    const minimized = document.getElementById("workflow-minimized");
    if (minimized) {
        minimized.classList.add("hidden");
        minimized.classList.remove("flex");
    }

    openWorkflowModal({ resetState: false });
}

/**
 * Hide the minimized bar if present
 */
function hideWorkflowMinimizedBar() {
    const minimized = document.getElementById("workflow-minimized");
    if (minimized) {
        minimized.classList.add("hidden");
        minimized.classList.remove("flex");
    }
}

/**
 * Update minimized bar label with current state
 * @param {string} stateId
 */
function updateWorkflowMinimizedStepLabel(stateId) {
    const stepLabel = document.getElementById("workflow-minimized-step");
    if (!stepLabel) return;

    const state = WORKFLOW_CONFIG.states[stateId];
    const label = state?.title ? state.title : `State ${stateId}`;
    stepLabel.textContent = `Current step: ${label}`;
}

/**
 * Render a given workflow state
 * @param {string} stateId
 */
function renderWorkflowState(stateId) {
    const state = WORKFLOW_CONFIG.states[stateId];
    if (!state) {
        console.warn("Unknown workflow state:", stateId);
        return;
    }

    workflowState.currentStateId = stateId;
    updateWorkflowMinimizedStepLabel(stateId);

    const stateNumberEl = document.getElementById("workflow-state-number");
    const titleEl = document.getElementById("workflow-state-title");
    const textEl = document.getElementById("workflow-state-text");
    const inputContainer = document.getElementById("workflow-input-container");
    const transitionsContainer = document.getElementById("workflow-transition-buttons");

    if (stateNumberEl) {
        stateNumberEl.textContent = `Page ${stateId}`;
        stateNumberEl.classList.remove("hidden");
    }

    if (titleEl) {
        if (state.title) {
            titleEl.textContent = resolveTemplate(state.title);
            titleEl.classList.remove("hidden");
        } else {
            titleEl.classList.add("hidden");
            titleEl.textContent = "";
        }
    }

    if (textEl) {
        if (state.text) {
            textEl.textContent = resolveTemplate(state.text);
            textEl.classList.remove("hidden");
        } else {
            textEl.classList.add("hidden");
            textEl.textContent = "";
        }
    }

    if (inputContainer) {
        inputContainer.innerHTML = "";
        const inputFields = getInputFieldsForState(state);

        if (inputFields.length > 0) {
            inputContainer.classList.remove("hidden");
            inputFields.forEach(fieldName => {
                const normalized = fieldName.toLowerCase();
                const promptKey = `input_${normalized}_prompt`;
                const prompt = WORKFLOW_CONFIG.texts[promptKey] || state.text || `Enter ${fieldName.replace(/_/g, " ")}`;

                const wrapper = document.createElement("div");
                wrapper.className = "space-y-2";

                const label = document.createElement("label");
                label.className = "block text-sm font-medium text-gray-300";
                label.setAttribute("for", `workflow-input-${normalized}`);
                label.textContent = resolveTemplate(prompt);

                const input = document.createElement("input");
                input.type = "text";
                input.id = `workflow-input-${normalized}`;
                input.className = "w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-gray-200 transition focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500";
                input.placeholder = resolveTemplate(prompt);
                input.value = workflowState.storedInputs[normalized] || "";

                wrapper.appendChild(label);
                wrapper.appendChild(input);
                inputContainer.appendChild(wrapper);
            });
        } else {
            inputContainer.classList.add("hidden");
        }
    }

    if (transitionsContainer) {
        transitionsContainer.innerHTML = "";
        (state.transitions || []).forEach(transition => {
            const button = createTransitionButton(transition);
            transitionsContainer.appendChild(button);
        });
    }
}

/**
 * Collect input fields for a state based on its actions
 * @param {Object} state
 * @returns {string[]}
 */
function getInputFieldsForState(state) {
    const fields = new Set();
    (state.transitions || []).forEach(transition => {
        (transition.actions || []).forEach(action => {
            if (action.type === "store_input" && action.field) {
                fields.add(action.field.toLowerCase());
            }
        });
    });
    return Array.from(fields);
}

/**
 * Create a button for a given transition configuration
 * @param {Object} transition
 * @returns {HTMLButtonElement}
 */
function createTransitionButton(transition) {
    const button = document.createElement("button");
    button.textContent = transition.button;
    button.className = getButtonThemeClasses(transition.button);

    if (!transition.actions || transition.actions.length === 0) {
        button.disabled = true;
        button.classList.add("cursor-not-allowed", "opacity-60");
        button.title = "This option is not available yet.";
        return button;
    }

    button.addEventListener("click", () => {
        handleTransition(transition);
    });

    return button;
}

/**
 * Determine button styling classes based on the label content
 * @param {string} label
 * @returns {string}
 */
function getButtonThemeClasses(label = "") {
    const base = "w-full rounded-lg border px-6 py-4 text-lg font-bold text-white shadow-lg transition";
    const normalized = label.toLowerCase();

    if (normalized.includes("back")) {
        return `${base} border-gray-600 bg-gray-700 hover:bg-gray-600`;
    }

    if (normalized.includes("channel")) {
        return `${base} border-purple-600 bg-purple-600 hover:bg-purple-700 hover:border-purple-700`;
    }

    if (normalized.includes("failure") || normalized.includes("stand down") || normalized.includes("deny")) {
        return `${base} border-red-700 bg-red-700 hover:bg-red-800 hover:border-red-800`;
    }

    if (normalized.includes("warning") || normalized.includes("no response") || normalized.includes("issue") || normalized.includes("trouble") || normalized.includes("server full")) {
        return `${base} border-amber-500 bg-amber-500 text-black hover:bg-amber-600 hover:border-amber-600`;
    }

    if (normalized.includes("store") || normalized.includes("nearest")) {
        return `${base} border-amber-500 bg-amber-500 text-black hover:bg-amber-600 hover:border-amber-600`;
    }

    if (normalized.includes("client response") || normalized.includes("invites") || normalized.includes("arrive") || normalized.includes("joining") || normalized.includes("extraction")) {
        return `${base} border-green-600 bg-green-600 hover:bg-green-700 hover:border-green-700`;
    }

    if (normalized.includes("party") || normalized.includes("friend") || normalized.includes("chat")) {
        return `${base} border-blue-600 bg-blue-600 hover:bg-blue-700 hover:border-blue-700`;
    }

    return `${base} border-blue-600 bg-blue-600 hover:bg-blue-700 hover:border-blue-700`;
}

/**
 * Handle transition button click
 * @param {Object} transition
 */
function handleTransition(transition) {
    if (!transition.actions || transition.actions.length === 0) {
        return;
    }

    executeActions(transition.actions);
}

/**
 * Execute a sequence of actions sequentially
 * @param {Array} actions
 * @param {number} startIndex
 * @returns {Promise<void>}
 */
function executeActions(actions, startIndex = 0) {
    if (!Array.isArray(actions) || startIndex >= actions.length) {
        return Promise.resolve();
    }

    const action = actions[startIndex];

    switch (action.type) {
        case "copy":
            return copyTextToClipboard(resolveTemplate(action.value || "")).then(() => executeActions(actions, startIndex + 1));

        case "copy_ref": {
            const referenced = WORKFLOW_CONFIG.texts[action.ref];
            if (!referenced) {
                console.warn("Missing text reference:", action.ref);
                return executeActions(actions, startIndex + 1);
            }
            return copyTextToClipboard(resolveTemplate(referenced)).then(() => executeActions(actions, startIndex + 1));
        }

        case "goto":
            handleGoto(action.target);
            return Promise.resolve();

        case "modal":
            return showWorkflowConfirmation(action.value || "Are you sure?").then(confirmed => {
                if (!confirmed) {
                    return Promise.resolve();
                }
                return executeActions(actions, startIndex + 1);
            });

        case "timer_reset":
            if (typeof resetAlertTimer === "function") {
                resetAlertTimer(true);
            }
            return executeActions(actions, startIndex + 1);

        case "timer_set":
            if (typeof setAlertTimerStage === "function" && action.value) {
                setAlertTimerStage(action.value);
            }
            return executeActions(actions, startIndex + 1);

        case "store_input": {
            const stored = storeWorkflowInput(action.field);
            if (!stored) {
                return Promise.resolve();
            }
            return executeActions(actions, startIndex + 1);
        }

        case "alert_status":
            if (action.value) {
                setChannelStatus(action.value);
            }
            return executeActions(actions, startIndex + 1);

        case "close_modal":
            hideWorkflowConfirmation();
            return executeActions(actions, startIndex + 1);

        default:
            console.warn("Unknown action type:", action);
            return executeActions(actions, startIndex + 1);
    }
}

/**
 * Copy text to the clipboard with notification feedback
 * @param {string} text
 * @returns {Promise<void>}
 */
function copyTextToClipboard(text) {
    if (!text) {
        showCopyNotification("Nothing to copy.", true);
        return Promise.resolve();
    }

    return navigator.clipboard.writeText(text).then(() => {
        showCopyNotification("Copied to clipboard!");
    }).catch(error => {
        console.error("Failed to copy workflow text:", error);
        showCopyNotification("Failed to copy!", true);
    });
}

/**
 * Resolve template tokens inside text values
 * @param {string} text
 * @returns {string}
 */
function resolveTemplate(text) {
    if (typeof text !== "string") {
        return "";
    }

    let resolved = text;

    resolved = resolved.replace(/\{([A-Z0-9_]+)\}/gi, (match, token) => {
        const normalized = token.toLowerCase();

        if (normalized === "team_lead_name") {
            if (typeof getLeadName === "function") {
                const leadName = getLeadName();
                if (leadName) {
                    return leadName;
                }
            }
            return "Medrunner Lead";
        }

        if (workflowState.storedInputs[normalized]) {
            return workflowState.storedInputs[normalized];
        }

        return match;
    });

    return applyTimestampReplacement(resolved);
}

/**
 * Replace timestamp placeholders with current time
 * @param {string} text
 * @returns {string}
 */
function applyTimestampReplacement(text) {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return text.replace(/<t:(\d+):R>/g, () => `<t:${currentTimestamp}:R>`);
}

/**
 * Store input from the current state
 * @param {string} field
 * @returns {boolean}
 */
function storeWorkflowInput(field) {
    if (!field) {
        return false;
    }

    const normalized = field.toLowerCase();
    const input = document.getElementById(`workflow-input-${normalized}`);
    if (!input) {
        console.warn("Missing workflow input field:", field);
        return false;
    }

    const value = input.value.trim();
    if (!value) {
        showCopyNotification("Please enter a value before storing.", true);
        input.focus();
        return false;
    }

    workflowState.storedInputs[normalized] = value;
    showCopyNotification(`Stored ${field.replace(/_/g, " ")}!`);
    return true;
}

/**
 * Update channel status display and persist it
 * @param {string} status
 * @param {Object} options
 * @param {boolean} options.persist
 */
function setChannelStatus(status, { persist = true } = {}) {
    const normalized = status || "Standby";
    workflowState.lastChannelStatus = normalized;

    const display = document.getElementById("alert-channel-status");
    if (display) {
        display.textContent = `Channel status: ${normalized}`;
    }

    if (persist) {
        try {
            localStorage.setItem(WORKFLOW_STORAGE_KEYS.CHANNEL_STATUS, normalized);
        } catch (error) {
            console.warn("Unable to persist channel status:", error);
        }
    }
}

/**
 * Navigate to another workflow state or tab
 * @param {string} target
 */
function handleGoto(target) {
    if (!target) {
        return;
    }

    const normalized = String(target);

    if (normalized.toUpperCase() === "AAR") {
        if (typeof switchTab === "function") {
            switchTab("aar");
        }
        closeWorkflowModal();
        return;
    }

    renderWorkflowState(normalized);
}

/**
 * Show confirmation modal for workflow actions
 * @param {string} message
 * @returns {Promise<boolean>}
 */
function showWorkflowConfirmation(message) {
    const modal = document.getElementById("workflow-confirm-modal");
    const messageEl = document.getElementById("workflow-confirm-message");
    const confirmBtn = document.getElementById("workflow-confirm-accept");
    const cancelBtn = document.getElementById("workflow-confirm-cancel");

    if (!modal || !messageEl || !confirmBtn || !cancelBtn) {
        return Promise.resolve(window.confirm(message));
    }

    messageEl.textContent = message;
    modal.classList.remove("hidden");
    modal.classList.add("flex");

    return new Promise(resolve => {
        workflowState.confirmationResolver = resolve;

        const cleanup = () => {
            confirmBtn.removeEventListener("click", onConfirm);
            cancelBtn.removeEventListener("click", onCancel);
        };

        const onConfirm = () => {
            cleanup();
            hideWorkflowConfirmation();
            resolve(true);
        };

        const onCancel = () => {
            cleanup();
            hideWorkflowConfirmation();
            resolve(false);
        };

        confirmBtn.addEventListener("click", onConfirm, { once: true });
        cancelBtn.addEventListener("click", onCancel, { once: true });
    });
}

/**
 * Hide confirmation modal if visible
 */
function hideWorkflowConfirmation() {
    const modal = document.getElementById("workflow-confirm-modal");
    if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }

    workflowState.confirmationResolver = null;
}

/**
 * Show copy notification
 * @param {string} message - The message to display
 * @param {boolean} isError - Whether this is an error notification
 */
function showCopyNotification(message, isError = false) {
    const notification = document.getElementById("copy-notification");
    const notificationText = document.getElementById("copy-notification-text");

    if (!notification || !notificationText) return;

    notificationText.textContent = message;

    if (isError) {
        notification.classList.remove("bg-green-600");
        notification.classList.add("bg-red-600");
    } else {
        notification.classList.remove("bg-red-600");
        notification.classList.add("bg-green-600");
    }

    notification.classList.remove("hidden");

    setTimeout(() => {
        notification.classList.add("hidden");
    }, 5000);
}

/**
 * Initialize workflow module defaults
 */
function initializeWorkflowModule() {
    updateWorkflowMinimizedStepLabel(WORKFLOW_DEFAULT_STATE);

    try {
        const savedStatus = localStorage.getItem(WORKFLOW_STORAGE_KEYS.CHANNEL_STATUS);
        if (savedStatus) {
            setChannelStatus(savedStatus, { persist: false });
            return;
        }
    } catch (error) {
        console.warn("Unable to read stored channel status:", error);
    }

    setChannelStatus(workflowState.lastChannelStatus, { persist: false });
}

initializeWorkflowModule();
