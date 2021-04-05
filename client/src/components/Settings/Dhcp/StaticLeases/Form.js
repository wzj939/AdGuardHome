import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Trans, useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { renderInputField } from '../../../../helpers/form';
import {
    validateIpv4,
    validateMac,
    validateRequiredValue,
    createValidateIpv4InCidr,
} from '../../../../helpers/validators';
import { FORM_NAME } from '../../../../helpers/constants';
import { toggleLeaseModal } from '../../../../actions';
import { subnetMaskToBitMask } from '../../../../helpers/helpers';

const Form = ({
    handleSubmit,
    reset,
    pristine,
    submitting,
    processingAdding,
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const dhcp = useSelector((state) => state.form[FORM_NAME.DHCPv4], shallowEqual);

    const onClick = () => {
        reset();
        dispatch(toggleLeaseModal());
    };

    const cidr = `${dhcp?.values?.v4?.gateway_ip}/${subnetMaskToBitMask(dhcp?.values?.v4?.subnet_mask)}`;
    const validateIpv4InCidr = createValidateIpv4InCidr(cidr);

    return (
        <form onSubmit={handleSubmit}>
            <div className="modal-body">
                <div className="form__group">
                    <Field
                        id="mac"
                        name="mac"
                        component={renderInputField}
                        type="text"
                        className="form-control"
                        placeholder={t('form_enter_mac')}
                        validate={[validateRequiredValue, validateMac]}
                    />
                </div>
                <div className="form__group">
                    <Field
                        id="ip"
                        name="ip"
                        component={renderInputField}
                        type="text"
                        className="form-control"
                        placeholder={t('form_enter_subnet_ip', { cidr })}
                        validate={[validateRequiredValue, validateIpv4, validateIpv4InCidr]}
                    />
                </div>
                <div className="form__group">
                    <Field
                        id="hostname"
                        name="hostname"
                        component={renderInputField}
                        type="text"
                        className="form-control"
                        placeholder={t('form_enter_hostname')}
                    />
                </div>
            </div>

            <div className="modal-footer">
                <div className="btn-list">
                    <button
                        type="button"
                        className="btn btn-secondary btn-standard"
                        disabled={submitting}
                        onClick={onClick}
                    >
                        <Trans>cancel_btn</Trans>
                    </button>
                    <button
                        type="submit"
                        className="btn btn-success btn-standard"
                        disabled={submitting || pristine || processingAdding}
                    >
                        <Trans>save_btn</Trans>
                    </button>
                </div>
            </div>
        </form>
    );
};

Form.propTypes = {
    pristine: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    processingAdding: PropTypes.bool.isRequired,
};

export default reduxForm({ form: FORM_NAME.LEASE })(Form);
