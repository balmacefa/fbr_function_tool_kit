import { createMachine } from "xstate";

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGEAWBDALgMQMoFkA6ASwgBswBiXAFQEEAlGgfVwFFdcBJAeQDkA2gAYAuolAAHAPaximYlIB24kAA9EAVgDshAGxCtWgIxHDADiFGAnBqMAaEAE9EAWiMBmACyFjWjQCYtT3chM09-fwBfSIc0LDwiAGMAJzAsYkUoXDhZJUoIJTASRQA3KQBrIoyyypdEiSszI2ExJBBpWXklFXUEKyt-QiF-L10goSsPI08HZwR3EJ9PfoiQi1tdaNiMHAJCdET5ErBs2FzFajY+ABFmfA5cOgBxNhaVDrkFZTbej2DCYJ+ITuIy6XT9IwaWaIEHeUG6DRmdxWLT+ZZmLRbEBxXZEWBgRQQDJQfA5dAwfKFYo1KqlCpgFxQTzlRwAVzebQ+XW+oF+XncAPcQJBYIhUKciCaAP6NncG38+iRWJxCUIrIkEHSmVO50pilpNOp9JcmFg5XQYA5khkn26P0Qnn+QmdwzBzuswV00IQEQ0hDR-WCJjlaM8mJi2J2qoAZmBMIlUMTSWdyXA9Qb6UbaqoyP4SgArK3tG3cnqIFZDEaeMaeCZTGYSn3+P0BqxBjwBR3hiOKKQQOAqFUEd4lr5lhA6JHaYGjXTuMxzszelxCoSEDyo-xCfQjISeIzKqN7UgUEedMf2hAaP1TrQz6uL3QNuYufxmQZzzdWYZCwwIw-xHsKRpPI2o5Be1rnnavKICMfpgho4Lbp4GgGBMS6NpCQyrgYyyIfOISbBGQ5EAcRwnOB0HFlBPJqLB2iEG2EKeGEWjuG+WjeoEH5ymYC4KteGhhhoAG4oQ+KEkmZIwGetq0b8GjuLoegYtoQoLOi4pzIEOhBP0IT7quiKeKJqrqpqoFZJRtFchBdEINMAR6EYaHTkiLFeo2bh+IQFhmP0hgsciaLhtsgFELG8aJpkyawKm8CcqOVG9GEAoBMCAnLAYgTLv4RiDKE+X9BigTVm20TREAA */
    context: {
      sessionId: "",
    },
    id: "ChatFSM",
    initial: "idle",
    states: {
      idle: {
        on: {
          START_SESSION: {
            target: "creatingSession",
          },
        },
      },
      creatingSession: {
        invoke: {
          src: "createSessionService",
          id: "invoke-cp981",
          onDone: [
            {
              target: "activeSession",
            },
          ],
        },
      },
      activeSession: {
        entry: {
          type: "displayMessages",
        },
        on: {
          SEND_MESSAGE: {
            target: "sendingMessage",
          },
        },
      },
      sendingMessage: {
        invoke: {
          src: "sendMessageService",
          id: "invoke-g4kyu",
          onDone: [
            {
              target: "updatingSession",
            },
          ],
        },
      },
      updatingSession: {
        invoke: {
          src: "updateSessionStatusService",
          id: "invoke-tskae",
          onDone: [
            {
              target: "fetchingMessages",
            },
          ],
        },
      },
      fetchingMessages: {
        invoke: {
          src: "fetchMessagesService",
          id: "invoke-xl2vj",
          onDone: [
            {
              target: "activeSession",
            },
          ],
        },
      },
    },
    schema: {
      events: {} as { type: "START_SESSION" } | { type: "SEND_MESSAGE" },
      context: {} as { sessionId: string },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      displayMessages: (context, event) => {},
    },
    services: {
      createSessionService: createMachine({
        /* ... */
      }),
      sendMessageService: createMachine({
        /* ... */
      }),
      updateSessionStatusService: createMachine({
        /* ... */
      }),
      fetchMessagesService: createMachine({
        /* ... */
      }),
    },
    guards: {},
    delays: {},
  }
);
