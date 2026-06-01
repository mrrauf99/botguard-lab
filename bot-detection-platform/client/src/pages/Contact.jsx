import { memo, useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import FormField, { Input } from '../components/ui/FormField';
import PageHeader from '../components/ui/PageHeader';

function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    e.target.reset();
  };

  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto max-w-lg px-4 sm:px-6">
        <PageHeader title="Contact Us" subtitle="We'd love to hear from you" />
        <Card>
          <form onSubmit={handleSubmit}>
            <FormField label="Name" id="contact-name">
              <Input id="contact-name" name="name" required />
            </FormField>
            <FormField label="Email" id="contact-email">
              <Input id="contact-email" name="email" type="email" required />
            </FormField>
            <FormField label="Message" id="contact-message">
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                className="w-full min-h-[120px] rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30 sm:text-sm"
              />
            </FormField>
            {sent && (
              <p className="mb-4 text-sm text-emerald" role="status">
                Thank you! Your message has been received.
              </p>
            )}
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}

export default memo(Contact);
