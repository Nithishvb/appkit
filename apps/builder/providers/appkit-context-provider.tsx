'use client'

import { ReactNode, useEffect, useState } from 'react'

import { UniqueIdentifier } from '@dnd-kit/core'
import { useTheme } from 'next-themes'
import { Toaster } from 'sonner'
import { useSnapshot } from 'valtio'

import { type ChainNamespace } from '@reown/appkit-common'
import { ConnectMethod, ConstantsUtil } from '@reown/appkit-core'
import { Features, ThemeMode, ThemeVariables, useAppKitState } from '@reown/appkit/react'

import { AppKitContext } from '@/contexts/appkit-context'
import { allAdapters, initialConfig, namespaceNetworksMap } from '@/lib/config'
import { defaultCustomizationConfig } from '@/lib/defaultConfig'
import { inter } from '@/lib/fonts'
import { URLState, urlStateUtils } from '@/lib/url-state'

import { ThemeStore } from '../lib/theme-store'

interface AppKitProviderProps {
  children: ReactNode
}

interface AppKitProviderProps {
  children: ReactNode
  initialConfig?: URLState | null
}

export const ContextProvider: React.FC<AppKitProviderProps> = ({ children }) => {
  const { initialized } = useAppKitState()

  const [features, setFeatures] = useState<Features>(
    initialConfig?.features || ConstantsUtil.DEFAULT_FEATURES
  )
  const { theme, setTheme } = useTheme()
  const [termsConditionsUrl, setTermsConditionsUrl] = useState(
    initialConfig?.termsConditionsUrl || ''
  )
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState(initialConfig?.privacyPolicyUrl || '')
  const [enableWallets, setEnableWallets] = useState<boolean>(
    Boolean(initialConfig?.enableWallets) || true
  )
  const [isDraggingByKey, setIsDraggingByKey] = useState<Record<ConnectMethod, boolean>>({
    email: false,
    wallet: false,
    social: false
  })
  const [enabledChains, setEnabledChains] = useState<ChainNamespace[]>(
    initialConfig?.enabledChains || ['eip155', 'solana', 'bip122']
  )
  const themeStore = useSnapshot(ThemeStore.state)
  const appKit = themeStore.modal

  function updateDraggingState(key: UniqueIdentifier, value: boolean) {
    setIsDraggingByKey(prev => ({
      ...prev,
      [key]: value
    }))
  }

  function removeChain(chain: ChainNamespace) {
    setEnabledChains(prev => {
      const newEnabledChains = prev.filter(c => c !== chain)
      urlStateUtils.updateURLWithState({ enabledChains: newEnabledChains })
      return newEnabledChains
    })
    appKit?.removeAdapter(chain)
  }

  function addChain(chain: ChainNamespace) {
    setEnabledChains(prev => {
      const newEnabledChains = [...prev, chain]
      urlStateUtils.updateURLWithState({ enabledChains: newEnabledChains })
      return newEnabledChains
    })
    // Doing this inside the setEnabledChains calling it two times - not sure why
    const adapter = allAdapters.find(a => a.namespace === chain)
    if (adapter) {
      appKit?.addAdapter(adapter, namespaceNetworksMap[chain])
    }
  }

  function updateFeatures(newFeatures: Partial<Features>) {
    setFeatures(prev => {
      // Update the AppKit state first
      const newAppKitValue = { ...prev, ...newFeatures }
      appKit?.updateFeatures(newAppKitValue)

      // Get the connection methods order since it's calculated based on injected connectors dynamically
      const order =
        newFeatures?.connectMethodsOrder === undefined
          ? appKit?.getConnectMethodsOrder()
          : newFeatures.connectMethodsOrder

      // Define and set new internal value with the order
      const newInternalValue = { ...newAppKitValue, connectMethodsOrder: order }
      urlStateUtils.updateURLWithState({ features: newInternalValue })

      return newInternalValue
    })
  }

  function updateEnableWallets(enabled: boolean) {
    setEnableWallets(() => {
      appKit?.updateOptions({ enableWallets: enabled })
      urlStateUtils.updateURLWithState({ enableWallets: enabled })
      return enabled
    })
  }

  function updateThemeMode(mode: ThemeMode) {
    setTheme(() => {
      appKit?.setThemeMode(mode)
      urlStateUtils.updateURLWithState({ themeMode: mode })
      return mode
    })
  }

  function updateUrls(urls: { termsConditions?: string; privacyPolicy?: string }) {
    if (urls.termsConditions !== undefined) {
      setTermsConditionsUrl(urls.termsConditions)
      appKit?.setTermsConditionsUrl(urls.termsConditions)
      urlStateUtils.updateURLWithState({ termsConditionsUrl: urls.termsConditions })
    }
    if (urls.privacyPolicy !== undefined) {
      setPrivacyPolicyUrl(urls.privacyPolicy)
      appKit?.setPrivacyPolicyUrl(urls.privacyPolicy)
      urlStateUtils.updateURLWithState({ privacyPolicyUrl: urls.privacyPolicy })
    }
  }

  function updateSocials(enabled: boolean) {
    if (enabled && !Array.isArray(features.socials)) {
      updateFeatures({ socials: ConstantsUtil.DEFAULT_FEATURES.socials })
    } else if (!enabled) {
      updateFeatures({ socials: false })
    }
  }

  function setThemeStoreVariables(variables: ThemeVariables) {
    ThemeStore.setAccentColor(variables['--w3m-accent'] || '')
    ThemeStore.setMixColor(variables['--w3m-color-mix'] || '')
    ThemeStore.setMixColorStrength(variables['--w3m-color-mix-strength'] || 0)
    ThemeStore.setBorderRadius(variables['--w3m-border-radius-master'] || '2px')
    ThemeStore.setFontFamily(variables['--w3m-font-family'] || inter.style.fontFamily)
  }

  function resetConfigs() {
    updateEnableWallets(true)
    updateFeatures(ConstantsUtil.DEFAULT_FEATURES)
    updateUrls({
      privacyPolicy: defaultCustomizationConfig.privacyPolicyUrl,
      termsConditions: defaultCustomizationConfig.termsConditionsUrl
    })
    setThemeStoreVariables({})
    updateThemeMode(defaultCustomizationConfig.themeMode)
  }

  useEffect(() => {
    if (initialized) {
      const connectMethodsOrder = appKit?.getConnectMethodsOrder()
      const order = connectMethodsOrder
      updateFeatures({ connectMethodsOrder: order })
    }
  }, [initialized])

  useEffect(() => {
    appKit?.setThemeMode(theme as ThemeMode)
  }, [])

  const socialsEnabled = Array.isArray(features.socials)

  return (
    <AppKitContext.Provider
      value={{
        config: {
          features,
          enableWallets,
          themeMode: theme as ThemeMode,
          themeVariables: {
            '--w3m-color-mix': themeStore.mixColor,
            '--w3m-accent': themeStore.accentColor,
            '--w3m-color-mix-strength': themeStore.mixColorStrength,
            '--w3m-border-radius-master': themeStore.borderRadius,
            '--w3m-font-family': themeStore.fontFamily
          },
          termsConditionsUrl,
          privacyPolicyUrl
        },
        enabledChains,
        removeChain,
        addChain,
        socialsEnabled,
        enableWallets,
        isDraggingByKey,
        updateFeatures,
        updateThemeMode,
        updateSocials,
        updateUrls,
        updateEnableWallets,
        setEnableWallets: updateEnableWallets,
        setSocialsOrder: appKit?.setSocialsOrder,
        updateDraggingState,
        resetConfigs
      }}
    >
      <Toaster theme={theme as ThemeMode} />
      {children}
    </AppKitContext.Provider>
  )
}
