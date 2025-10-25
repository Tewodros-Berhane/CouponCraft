import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BulkShareModal = ({ isVisible, onClose, onBulkShare, availableChannels }) => {
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [scheduleOption, setScheduleOption] = useState('now');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const scheduleOptions = [
    { value: 'now', label: 'Share Now', description: 'Share immediately across selected channels' },
    { value: 'scheduled', label: 'Schedule for Later', description: 'Set a specific date and time' },
    { value: 'optimal', label: 'Optimal Timing', description: 'AI-powered best time recommendation' }
  ];

  const handleChannelToggle = (channelId) => {
    setSelectedChannels(prev => 
      prev?.includes(channelId) 
        ? prev?.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleBulkShare = async () => {
    if (selectedChannels?.length === 0) return;

    setIsSharing(true);
    
    const shareData = {
      channels: selectedChannels,
      schedule: scheduleOption,
      scheduleDate: scheduleOption === 'scheduled' ? scheduleDate : null,
      scheduleTime: scheduleOption === 'scheduled' ? scheduleTime : null,
      customMessage: customMessage?.trim()
    };

    // Simulate bulk sharing process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onBulkShare(shareData);
    setIsSharing(false);
    onClose();
  };

  const getChannelIcon = (channelType) => {
    const icons = {
      email: 'Mail',
      facebook: 'Facebook',
      instagram: 'Instagram',
      twitter: 'Twitter',
      whatsapp: 'MessageCircle',
      linkedin: 'Linkedin'
    };
    return icons?.[channelType] || 'Share';
  };

  const getChannelColor = (channelType) => {
    const colors = {
      email: '#2563eb',
      facebook: '#1877f2',
      instagram: '#e4405f',
      twitter: '#1da1f2',
      whatsapp: '#25d366',
      linkedin: '#0077b5'
    };
    return colors?.[channelType] || '#6b7280';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-level-4 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Bulk Share</h2>
            <p className="text-sm text-muted-foreground">Share across multiple channels simultaneously</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} iconName="X" />
        </div>

        <div className="p-6 space-y-6">
          {/* Channel Selection */}
          <div>
            <h3 className="font-medium text-foreground mb-4">Select Channels</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableChannels?.map((channel) => (
                <div key={channel?.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-150">
                  <Checkbox
                    checked={selectedChannels?.includes(channel?.id)}
                    onChange={() => handleChannelToggle(channel?.id)}
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Icon 
                        name={getChannelIcon(channel?.type)} 
                        size={16} 
                        color={getChannelColor(channel?.type)}
                      />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{channel?.name}</div>
                      <div className="text-xs text-muted-foreground">{channel?.audience} followers</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduling Options */}
          <div>
            <Select
              label="Scheduling"
              description="Choose when to share your coupon"
              options={scheduleOptions}
              value={scheduleOption}
              onChange={setScheduleOption}
            />

            {scheduleOption === 'scheduled' && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input
                  label="Date"
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e?.target?.value)}
                  min={new Date()?.toISOString()?.split('T')?.[0]}
                />
                <Input
                  label="Time"
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e?.target?.value)}
                />
              </div>
            )}

            {scheduleOption === 'optimal' && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="Sparkles" size={16} color="#2563eb" className="mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">AI Recommendation</p>
                    <p className="text-blue-700">Based on your audience activity, the best time to share is Tuesday at 2:00 PM for maximum engagement.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Custom Message */}
          <div>
            <Input
              label="Custom Message (Optional)"
              type="text"
              placeholder="Add a personal message to accompany your coupon..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e?.target?.value)}
              description="This message will be included with your coupon on supported platforms"
            />
          </div>

          {/* Preview Summary */}
          {selectedChannels?.length > 0 && (
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Share Summary</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• {selectedChannels?.length} channel{selectedChannels?.length !== 1 ? 's' : ''} selected</p>
                <p>• {scheduleOption === 'now' ? 'Immediate sharing' : 
                     scheduleOption === 'scheduled' ? `Scheduled for ${scheduleDate} at ${scheduleTime}` :
                     'Optimal timing enabled'}</p>
                {customMessage && <p>• Custom message included</p>}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">
            {selectedChannels?.length} of {availableChannels?.length} channels selected
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={handleBulkShare}
              disabled={selectedChannels?.length === 0 || isSharing}
              loading={isSharing}
              iconName="Share"
              iconPosition="left"
            >
              {scheduleOption === 'now' ? 'Share Now' : 'Schedule Share'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkShareModal;