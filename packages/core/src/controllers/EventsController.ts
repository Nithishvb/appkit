import { proxy, subscribe as sub } from 'valtio/vanilla'

import { ConstantsUtil, isSafe } from '@reown/appkit-common'

import { CoreHelperUtil } from '../utils/CoreHelperUtil.js'
import { FetchUtil } from '../utils/FetchUtil.js'
import type { Event } from '../utils/TypeUtil.js'
import { AlertController } from './AlertController.js'
import { OptionsController } from './OptionsController.js'

// -- Helpers ------------------------------------------- //
const baseUrl = CoreHelperUtil.getAnalyticsUrl()
const api = new FetchUtil({ baseUrl, clientId: null })
const excluded = ['MODAL_CREATED']

// -- Types --------------------------------------------- //
export interface EventsControllerState {
  timestamp: number
  reportedErrors: Record<string, boolean>
  data: Event
}

// -- State --------------------------------------------- //
const state = proxy<EventsControllerState>({
  timestamp: Date.now(),
  reportedErrors: {},
  data: {
    type: 'track',
    event: 'MODAL_CREATED'
  }
})

// -- Controller ---------------------------------------- //
export const EventsController = {
  state,

  subscribe(callback: (newState: EventsControllerState) => void) {
    return sub(state, () => callback(state))
  },

  _getApiHeaders() {
    const { projectId, sdkType, sdkVersion } = OptionsController.state

    return {
      'x-project-id': projectId,
      'x-sdk-type': sdkType,
      'x-sdk-version': sdkVersion || 'html-wagmi-4.2.2'
    }
  },

  async _sendAnalyticsEvent(payload: EventsControllerState) {
    try {
      if (excluded.includes(payload.data.event) || typeof window === 'undefined') {
        return
      }

      await api.post({
        path: '/e',
        headers: EventsController._getApiHeaders(),
        body: {
          eventId: CoreHelperUtil.getUUID(),
          url: window.location.href,
          domain: window.location.hostname,
          timestamp: payload.timestamp,
          props: payload.data
        }
      })

      state.reportedErrors['FORBIDDEN'] = false
    } catch (err) {
      const isForbiddenError =
        err instanceof Error &&
        err.cause instanceof Response &&
        err.cause.status === ConstantsUtil.HTTP_STATUS_CODES.FORBIDDEN &&
        !state.reportedErrors['FORBIDDEN']

      if (isForbiddenError) {
        AlertController.open(
          {
            shortMessage: 'Invalid App Configuration',
            longMessage: `Origin ${
              isSafe() ? window.origin : 'uknown'
            } not found on Allowlist - update configuration on cloud.reown.com`
          },
          'error'
        )

        state.reportedErrors['FORBIDDEN'] = true
      }
    }
  },

  sendEvent(data: EventsControllerState['data']) {
    state.timestamp = Date.now()
    state.data = data
    if (OptionsController.state.features?.analytics) {
      EventsController._sendAnalyticsEvent(state)
    }
  }
}
