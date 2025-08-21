import preview from '#.storybook/preview'
import { Form } from './Form'
import { expect, fn, userEvent, within } from 'storybook/test'

const meta = preview.meta({
  title: 'Example/Form',
  component: Form,
  args: {
    onSubmit: fn(),
  },
})

export const Default = meta.story({})
Default.test(
  'should submit with correct values',
  async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const nameInput = canvas.getByLabelText('Name')
    const emailInput = canvas.getByLabelText('Email')

    await userEvent.type(nameInput, 'John Doe')
    await userEvent.type(emailInput, 'john@doe.com')

    const submitButton = canvas.getByRole('button', { name: /Submit/i })
    await userEvent.click(submitButton)

    await expect(args.onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@doe.com',
    })
  }
)
Default.test(
  'should error when submitting with empty values',
  async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const submitButton = canvas.getByRole('button', { name: /Submit/i })
    await userEvent.click(submitButton)
    await expect(canvas.getByText('Name is required')).toBeInTheDocument()
    await expect(canvas.getByText('Email is required')).toBeInTheDocument()
    await expect(args.onSubmit).not.toHaveBeenCalled()
  }
)

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
})
Disabled.test(
  'inputs should not be editable when disabled',
  async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nameInput = canvas.getByLabelText('Name')
    await expect(nameInput).toBeDisabled()

    const emailInput = canvas.getByLabelText('Email')
    await expect(emailInput).toBeDisabled()
  }
)
Disabled.test(
  'should not submit when disabled',
  async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const submitButton = canvas.getByRole('button', { name: /Submit/i })
    await userEvent.click(submitButton)
    await expect(args.onSubmit).not.toHaveBeenCalled()
  }
)
