import Parent from '#components/utils/Parent'
import PaymentMethodContext from '#context/PaymentMethodContext'
import { type ChildrenFunction } from '#typings/index'
import type { StripeElementLocale } from '@stripe/stripe-js'
import { type ReactNode, useContext, useEffect, useRef } from 'react'
import { type PaymentSourceProps } from './PaymentSource'
import OrderContext from '#context/OrderContext'

export interface ExternalPaymentConfig {
  /**
   * Show the component. Default is false
   */
  show?: boolean
  /**
   * Use to display information about the external payment or whatever else.
   */
  customComponent?: ChildrenFunction<Omit<Props, 'customComponent'>>
  /**
   * The payment source token, as generated by the external gateway SDK. Credit Card numbers are rejected.
   */
  payment_source_token: string

  infoMessage?: {
    text?: string | ReactNode
    className?: string
  }
}

interface Props
  extends Omit<ExternalPaymentConfig, 'payment_source_token'>,
    Pick<PaymentSourceProps, 'templateCustomerSaveToWallet'> {
  paymentSourceToken: string
  locale?: StripeElementLocale
}

export function ExternalPayment(props: Props): JSX.Element | null {
  const { setPaymentRef } = useContext(PaymentMethodContext)
  const { order, updateOrder } = useContext(OrderContext)
  const ref = useRef<null | HTMLFormElement>(null)
  useEffect(() => {
    if (ref?.current != null) {
      ref.current.onsubmit = async () => {
        return true
      }
      setPaymentRef({ ref })
    }
  }, [ref])
  const parentProps = {
    ...props,
    order,
    updateOrder
  }
  return props?.customComponent != null && props.show ? (
    <form ref={ref}>
      <Parent {...parentProps}>{props.customComponent}</Parent>
      {props?.templateCustomerSaveToWallet != null && (
        <Parent {...{ name: 'save_payment_source_to_customer_wallet' }}>
          {props.templateCustomerSaveToWallet}
        </Parent>
      )}
    </form>
  ) : null
}

export default ExternalPayment
