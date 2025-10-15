/**
 * CTABlock Component
 * Call-to-action block for newsletters, contact forms, etc.
 */

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CTABlockProps } from '@/types'
import { cn, trackEvent } from '@/lib/utils'
import { Mail, MessageCircle, ExternalLink, Lock } from 'lucide-react'

interface CTABlockComponentProps {
  props: CTABlockProps
  className?: string
  isEditing?: boolean
  isLocked?: boolean
}

export function CTABlock({ props, className, isEditing = false, isLocked = false }: CTABlockComponentProps) {
  const { type, title, description, buttonText, action } = props

  const handleCTAClick = () => {
    if (isEditing || isLocked) return

    trackEvent('cta_click', {
      ctaType: type,
      actionType: action.type,
      target: action.target,
    })

    if (action.type === 'email') {
      window.location.href = `mailto:${action.target}`
    } else if (action.type === 'link') {
      window.open(action.target, '_blank', 'noopener,noreferrer')
    } else if (action.type === 'form') {
      // Handle form submission
      console.log('Form submission:', action.target)
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'newsletter':
        return <Mail className="w-5 h-5" />
      case 'contact':
        return <MessageCircle className="w-5 h-5" />
      default:
        return <ExternalLink className="w-5 h-5" />
    }
  }

  if (isLocked) {
    return (
      <Card className={cn(
        'relative p-6 text-center space-y-4 bg-gray-50 border-dashed',
        'cta-block', // CSS class for template styling
        className
      )}>
        <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="text-center space-y-2">
            <Lock className="w-8 h-8 mx-auto text-gray-400" />
            <p className="text-sm font-medium text-gray-600">Premium Feature</p>
            <p className="text-xs text-gray-500">Upgrade to unlock Call-to-Action blocks</p>
          </div>
        </div>
        
        <div className="opacity-30">
          <h3 className="text-xl font-semibold">{title}</h3>
          {description && <p className="text-muted-foreground">{description}</p>}
          <Button className="gap-2" disabled>
            {getIcon()}
            {buttonText}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn(
      'p-6 text-center space-y-4 bg-gradient-to-br from-blue-50 to-purple-50 border-2',
      'cta-block', // CSS class for template styling
      isEditing && 'outline-dashed outline-2 outline-blue-400 outline-offset-2',
      className
    )}>
      <div className="space-y-2">
        <h3 className={cn(
          'text-xl font-semibold text-gray-900',
          'cta-title' // CSS class for template styling
        )}>
          {title}
        </h3>
        
        {description && (
          <p className={cn(
            'text-muted-foreground',
            'cta-description' // CSS class for template styling
          )}>
            {description}
          </p>
        )}
      </div>
      
      <Button
        size="lg"
        className={cn(
          'gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
          'cta-button' // CSS class for template styling
        )}
        onClick={handleCTAClick}
        disabled={isEditing}
      >
        {getIcon()}
        {buttonText}
      </Button>
    </Card>
  )
}

// Editor component for customizing CTABlock props
export function CTABlockEditor({ 
  props, 
  onChange, 
  className 
}: {
  props: CTABlockProps
  onChange: (props: CTABlockProps) => void
  className?: string
}) {
  const handleChange = (field: keyof CTABlockProps, value: any) => {
    onChange({ ...props, [field]: value })
  }

  const handleActionChange = (field: string, value: any) => {
    onChange({ 
      ...props, 
      action: { ...props.action, [field]: value }
    })
  }

  return (
    <div className={cn('space-y-4 p-4', className)}>
      <div>
        <label className="block text-sm font-medium mb-2">CTA Type</label>
        <select
          value={props.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newsletter">Newsletter</option>
          <option value="contact">Contact</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={props.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter CTA title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description (optional)</label>
        <textarea
          value={props.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe what this CTA does"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Button Text</label>
        <input
          type="text"
          value={props.buttonText}
          onChange={(e) => handleChange('buttonText', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Subscribe, Contact, etc."
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium">Action</label>
        
        <div>
          <label className="block text-xs text-gray-600 mb-1">Action Type</label>
          <select
            value={props.action.type}
            onChange={(e) => handleActionChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="email">Email</option>
            <option value="link">External Link</option>
            <option value="form">Form</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">
            {props.action.type === 'email' && 'Email Address'}
            {props.action.type === 'link' && 'URL'}
            {props.action.type === 'form' && 'Form ID/Endpoint'}
          </label>
          <input
            type={props.action.type === 'email' ? 'email' : props.action.type === 'link' ? 'url' : 'text'}
            value={props.action.target}
            onChange={(e) => handleActionChange('target', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={
              props.action.type === 'email' ? 'your@email.com' :
              props.action.type === 'link' ? 'https://yoursite.com' :
              'form-id-or-endpoint'
            }
          />
        </div>
      </div>
    </div>
  )
}